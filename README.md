# 🎯 scrape-copy-strateco

Una micro API progettata per supportare strumenti di copywriting AI, offrendo esempi reali di copy tratti da archivi pubblici e siti dedicati allo storico del marketing diretto.

## 📋 Descrizione

Il progetto nasce per alimentare agenti AI (es. Gary – il Copywriter di StrateCo) con materiale originale autentico, utile per:

- ✅ Mostrare all'utente esempi reali (non inventati dall'AI)
- ✅ Ispirare headline, sales letter, annunci stampa
- ✅ Migliorare le risposte grazie a esempi coerenti e contestualizzati

## 🚀 Installazione

1. **Clona o scarica il progetto**
2. **Installa le dipendenze:**
   ```bash
   cd scrape-copy-strateco
   npm install
   ```

3. **Avvia il server:**
   ```bash
   npm start
   ```
   
   Per lo sviluppo (con auto-reload):
   ```bash
   npm run dev
   ```

4. **Accedi all'interfaccia web:**
   Apri il browser su `http://localhost:3000`

## 🔧 Configurazione

Il file `sources.json` contiene la configurazione dei siti da cui fare scraping. È possibile aggiungere nuovi siti tramite l'interfaccia web o modificando direttamente il file.

### Struttura configurazione sorgente:

```json
{
  "name": "Nome del sito",
  "baseUrl": "https://esempio.com/?s=",
  "resultSelector": "selettore CSS per i risultati",
  "titleSelector": "selettore CSS per il titolo",
  "linkSelector": "selettore CSS per il link",
  "textSelector": "selettore CSS per il testo",
  "imageSelector": "selettore CSS per l'immagine (opzionale)"
}
```

## 📡 API Endpoints

### POST `/scrape-copy-example`
Recupera un esempio di copy basato su una query.

**Request:**
```json
{
  "query": "headline per dentista"
}
```

**Response:**
```json
{
  "title": "Titolo dell'esempio",
  "source": "https://link-alla-fonte.com",
  "type": "swipe_example",
  "image_url": "https://link-immagine.jpg",
  "text": "Testo dell'esempio di copy..."
}
```

### GET `/sources`
Restituisce la lista dei siti configurati.

**Response:**
```json
[
  {
    "name": "Swiped.co",
    "baseUrl": "https://swiped.co/?s=",
    "resultSelector": "article.post",
    "titleSelector": "h2.entry-title",
    "linkSelector": "a",
    "textSelector": ".ad__copy",
    "imageSelector": ".ad__image img"
  }
]
```

### POST `/sources`
Aggiunge un nuovo sito alla configurazione.

**Request:**
```json
{
  "name": "Nuovo Sito",
  "baseUrl": "https://nuovo-sito.com/?search=",
  "resultSelector": ".result",
  "titleSelector": "h3",
  "linkSelector": "a",
  "textSelector": ".content",
  "imageSelector": "img"
}
```

### GET `/health`
Health check dell'API.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

## 💻 Esempi di utilizzo

### Con curl:
```bash
# Ottenere un esempio
curl -X POST http://localhost:3000/scrape-copy-example \
  -H "Content-Type: application/json" \
  -d '{"query": "headline per ristorante"}'

# Health check
curl http://localhost:3000/health
```

### Con JavaScript:
```javascript
// Ottenere un esempio
const response = await fetch('http://localhost:3000/scrape-copy-example', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'sales letter per integratori' })
});

const example = await response.json();
console.log(example);
```

## 🌟 Caratteristiche

- **API pubblica e leggera**: Facilmente integrabile in qualsiasi sistema
- **Interfaccia web intuitiva**: Per gestire facilmente le sorgenti
- **Configurazione flessibile**: Aggiunta di nuovi siti tramite selettori CSS
- **Gestione errori robusta**: Logging e error handling completi
- **Headers personalizzati**: User-Agent e headers per evitare blocchi
- **Validazione input**: Controllo dei parametri obbligatori

## 🛠️ Struttura del progetto

```
scrape-copy-strateco/
├── index.js              # Server Express principale
├── scraper.js            # Logica di scraping
├── sources.json          # Configurazione siti sorgente
├── package.json          # Dipendenze Node.js
├── public/
│   └── index.html        # Interfaccia web
└── README.md             # Documentazione
```

## 🔍 Troubleshooting

### Problemi comuni:

1. **Scraping fallito**: Verificare che i selettori CSS siano corretti per il sito target
2. **Nessun risultato**: La query potrebbe essere troppo specifica o il sito potrebbe non avere contenuti correlati
3. **Errori di rete**: Alcuni siti potrebbero bloccare le richieste automatiche

### Log e debugging:
I log sono disponibili nella console del server per diagnosticare problemi di scraping.

## 📝 Note tecniche

- **Rate limiting**: Non implementato nella versione base, da aggiungere per uso in produzione
- **Cache**: Non implementata, ogni richiesta fa scraping in tempo reale
- **Sicurezza**: Validazione base dei selettori CSS per evitare XSS

## 🚨 Disclaimer

Questo strumento è progettato per uso educativo e di ricerca. Assicurarsi di rispettare i termini di servizio dei siti target e le leggi sul copyright quando si utilizzano i contenuti recuperati.

## 📄 Licenza

MIT License - Vedi file LICENSE per dettagli. 