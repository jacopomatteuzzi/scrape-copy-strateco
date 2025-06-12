# 🎯 Integrazione con StrateCo - Agente Gary Copywriter

## 📋 Overview dell'integrazione

L'API `scrape-copy-strateco` è ora live e pronta per essere integrata con l'agente Gary di StrateCo per fornire esempi reali di copywriting.

## 🔗 Dettagli API

### **Base URL**: `https://scrape-copy-strateco.onrender.com`

### **Endpoint principale**: `POST /scrape-copy-example`

## 📡 Configurazione per StrateCo

### 1. **Parametri di configurazione agente Gary**

```json
{
  "api_name": "scrape-copy-strateco",
  "api_url": "https://scrape-copy-strateco.onrender.com/scrape-copy-example",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "timeout": 30000,
  "description": "API per recuperare esempi reali di copywriting da archivi pubblici"
}
```

### 2. **Formato richiesta**

```json
{
  "query": "descrizione del tipo di copy richiesto"
}
```

**Esempi di query efficaci:**
- `"headline per dentista"`
- `"sales letter prodotto dimagrante"`
- `"email marketing e-commerce"`
- `"annuncio Facebook immobiliare"`
- `"landing page corso online"`

### 3. **Formato risposta**

#### Successo (200):
```json
{
  "title": "Titolo dell'esempio",
  "source": "https://link-alla-fonte-originale.com",
  "type": "swipe_example",
  "image_url": "https://link-immagine.jpg",
  "text": "Testo completo dell'esempio di copy...",
  "scraped_from": "Nome della sorgente",
  "scraped_at": "2024-01-15T10:30:00.000Z",
  "category": "business",
  "note": "Note aggiuntive se presente"
}
```

#### Errore (500):
```json
{
  "error": "Descrizione dell'errore",
  "detail": "Dettagli tecnici"
}
```

## 🤖 Implementazione nell'agente Gary

### **Prompt di sistema suggerito:**

```
Sei Gary, un copywriter esperto che aiuta a creare copy persuasivi e efficaci.

Quando un utente richiede esempi di copywriting, usa l'API scrape-copy-strateco per recuperare esempi reali e ispirazione.

API disponibile:
- URL: https://scrape-copy-strateco.onrender.com/scrape-copy-example
- Metodo: POST
- Payload: {"query": "descrizione del copy richiesto"}

Dopo aver recuperato l'esempio:
1. Analizza la struttura e le tecniche utilizzate
2. Spiega perché l'esempio è efficace
3. Proponi varianti adattate al contesto specifico dell'utente
4. Cita sempre la fonte originale per trasparenza

Se l'API non è disponibile, procedi con le tue conoscenze ma informa l'utente che non hai esempi dal vivo.
```

### **Funzione di chiamata API (JavaScript):**

```javascript
async function getSwipeExample(query) {
  try {
    const response = await fetch('https://scrape-copy-strateco.onrender.com/scrape-copy-example', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query }),
      timeout: 30000
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Errore nel recuperare esempio:', error);
    return null;
  }
}

// Uso nell'agente
const example = await getSwipeExample("headline per ristorante");
if (example) {
  console.log(`Esempio trovato: ${example.title}`);
  console.log(`Fonte: ${example.source}`);
  console.log(`Testo: ${example.text}`);
}
```

### **Funzione di chiamata API (Python):**

```python
import requests
import json

def get_swipe_example(query):
    try:
        response = requests.post(
            'https://scrape-copy-strateco.onrender.com/scrape-copy-example',
            headers={'Content-Type': 'application/json'},
            json={'query': query},
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"API Error: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Errore nel recuperare esempio: {e}")
        return None

# Uso nell'agente
example = get_swipe_example("sales letter fitness")
if example:
    print(f"Esempio trovato: {example['title']}")
    print(f"Fonte: {example['source']}")
    print(f"Testo: {example['text']}")
```

## 🎯 Casi d'uso specifici per Gary

### **1. Richiesta di headline**
```
Utente: "Ho bisogno di una headline per il mio studio dentistico"

Gary: 
1. Chiama API con query="headline dentista"
2. Analizza l'esempio ricevuto
3. Spiega le tecniche (urgenza, beneficio, social proof)
4. Propone 3-5 varianti personalizzate
5. Cita la fonte originale
```

### **2. Richiesta di email marketing**
```
Utente: "Come posso scrivere un'email promozionale efficace?"

Gary:
1. Chiama API con query="email marketing promozionale"
2. Mostra l'esempio come reference
3. Spiega la struttura (oggetto, apertura, body, CTA)
4. Adatta l'esempio al business dell'utente
```

### **3. Analisi e miglioramento**
```
Utente: "Puoi migliorare questo copy?"

Gary:
1. Analizza il copy dell'utente
2. Chiama API con query correlata al tipo di copy
3. Compara con l'esempio recuperato
4. Suggerisce miglioramenti specifici basati su esempi reali
```

## ⚙️ Gestione errori e fallback

### **Nel sistema StrateCo:**

```javascript
async function handleCopyRequest(userQuery) {
  // Tentativo di recuperare esempio reale
  const swipeExample = await getSwipeExample(userQuery);
  
  if (swipeExample) {
    return `Ho trovato un esempio reale che può ispirarti:
    
**${swipeExample.title}**
${swipeExample.text}

*Fonte: ${swipeExample.source}*

Analisi: [continua con l'analisi dell'esempio]`;
  } else {
    return `Al momento non riesco ad accedere agli esempi dal vivo, ma posso aiutarti basandomi sulla mia esperienza nel copywriting...`;
  }
}
```

## 🔧 Monitoraggio e maintenance

### **Health check**
Prima di ogni sessione, Gary può verificare la disponibilità dell'API:

```javascript
async function checkAPIHealth() {
  try {
    const response = await fetch('https://scrape-copy-strateco.onrender.com/health');
    return response.ok;
  } catch {
    return false;
  }
}
```

### **Logging per debugging**
Traccia le chiamate API per identificare pattern e migliorare il servizio:

```javascript
console.log(`API chiamata: query="${query}", risultato=${example ? 'successo' : 'fallimento'}`);
```

## 🚀 Benefici per l'utente StrateCo

1. **Esempi reali**: Non più copy inventati dall'AI
2. **Ispirazione autentica**: Esempi da campagne di successo
3. **Fonte trasparente**: Ogni esempio ha link alla fonte originale
4. **Varietà**: Database in espansione tramite interfaccia web
5. **Analisi profonda**: Gary può spiegare perché gli esempi funzionano

## 📈 Prossimi sviluppi

- Aggiunta di più sorgenti di scraping
- Sistema di rating degli esempi
- Categorizzazione automatica
- Cache per migliorare performance
- Personalizzazione esempi per settore

---

**🔗 API Dashboard**: https://scrape-copy-strateco.onrender.com
**🔧 Health Check**: https://scrape-copy-strateco.onrender.com/health
**📊 Gestione Sorgenti**: https://scrape-copy-strateco.onrender.com (interfaccia web) 