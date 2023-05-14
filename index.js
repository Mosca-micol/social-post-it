const fs = require('fs'); // importa il modulo per gestire i file system
const pathJSON = './data/posts.json'; // definisce il percorso del file JSON

// funzione che aggiunge un oggetto al file JSON
function appendToJson(object) {
  try {  
    // legge il contenuto del file JSON
    const data = fs.readFileSync(pathJSON);
    // converte il contenuto in un oggetto JavaScript
    const parsedData = JSON.parse(data);

    // verifica se l'oggetto è già presente nel file JSON
    for (let i in parsedData) {
      if (JSON.stringify(object) == JSON.stringify(parsedData[i])) {
        console.log("copia trovata");
        return;
      }
    }

    // verifica se l'utente ha inserito del testo nei campi
    if (object.nome.trim() === '' || object.messaggio.trim() === '') {
      console.log('Input vuoto, non aggiungo il post-it');
      return;
    }

    // aggiunge l'oggetto all'array di messaggi e salva il file JSON
    parsedData.push(object);
    fs.writeFileSync(pathJSON, JSON.stringify(parsedData, null, 2));
  } catch (error) {
    console.error(error);
  }
}

// funzione che legge il contenuto del file JSON e lo converte in un oggetto JavaScript
function readJson() {
  try {
    const data = fs.readFileSync(pathJSON, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return null;
  }
}

const express = require('express');
const path = require("path");
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.set('views', path.join(__dirname, './pages'));
app.use(express.static(path.join(__dirname, 'public')));

// gestisce la richiesta GET per la visualizzazione dei messaggi
app.get('/', (req, res) => {
  const data = readJson();
  res.render('home', { data: data });
});

// gestisce la richiesta GET per il form di inserimento del messaggio
app.get('/postIt', (req, res) => {
  res.render('postIt');
});

// gestisce la richiesta POST per l'inserimento del messaggio
app.post('/home', (req, res) => {
  // ottiene i dati inseriti dall'utente
  const username = req.body.username.trim();
  const text = req.body.text.trim();
  // aggiunge il messaggio al file JSON
  appendToJson({ 'nome': username, 'messaggio': text });
  // legge nuovamente il file JSON e restituisce i dati alla pagina di visualizzazione
  const data = readJson();
  res.render('home', { data: data });
});

app.listen(8080); // avvia il server sulla porta 8080
