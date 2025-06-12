const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const scrapeExample = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Route per ottenere le sorgenti configurate
app.get('/sources', (req, res) => {
  try {
    const sources = JSON.parse(fs.readFileSync('sources.json', 'utf8'));
    res.json(sources);
  } catch (error) {
    console.error('Errore lettura sources.json:', error);
    res.status(500).json({ error: 'Errore nel leggere le sorgenti' });
  }
});

// Route per aggiungere una nuova sorgente
app.post('/sources', (req, res) => {
  try {
    const sources = JSON.parse(fs.readFileSync('sources.json', 'utf8'));
    
    // Validazione dei campi obbligatori
    const required = ['name', 'baseUrl', 'resultSelector', 'titleSelector', 'linkSelector', 'textSelector'];
    const missing = required.filter(field => !req.body[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({ 
        error: 'Campi obbligatori mancanti', 
        missing: missing 
      });
    }

    sources.push(req.body);
    fs.writeFileSync('sources.json', JSON.stringify(sources, null, 2));
    res.json({ success: true, message: 'Sorgente aggiunta con successo' });
  } catch (error) {
    console.error('Errore aggiunta sorgente:', error);
    res.status(500).json({ error: 'Errore nell\'aggiungere la sorgente' });
  }
});

// Route principale API per ottenere esempi di copy
app.post('/scrape-copy-example', async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Il campo query è obbligatorio' });
  }

  try {
    const result = await scrapeExample(query);
    res.json(result);
  } catch (error) {
    console.error('Errore scraping:', error);
    res.status(500).json({ 
      error: 'Scraping fallito', 
      detail: error.message 
    });
  }
});

// Route di health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: require('./package.json').version 
  });
});

// Gestione errori 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`🚀 Server scrape-copy-strateco in esecuzione sulla porta ${PORT}`);
  console.log(`📝 Interfaccia web: http://localhost:${PORT}`);
  console.log(`🔗 API endpoint: POST http://localhost:${PORT}/scrape-copy-example`);
}); 