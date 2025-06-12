# 🚀 Guida al deployment su Render

## 📋 Prerequisiti

1. Account Render (gratuito): https://render.com
2. Repository GitHub con il codice (opzionale ma consigliato)

## 🔧 Opzione 1: Deploy da GitHub (Raccomandato)

### Step 1: Preparare il repository
```bash
# Inizializza git se non l'hai già fatto
git init

# Aggiungi tutti i file
git add .

# Commit iniziale
git commit -m "Initial commit - scrape-copy-strateco"

# Aggiungi il repository remoto GitHub
git remote add origin https://github.com/TUO_USERNAME/scrape-copy-strateco.git

# Push del codice
git push -u origin main
```

### Step 2: Configurare Render
1. Vai su https://render.com e accedi
2. Clicca "New +" → "Web Service"
3. Connetti il tuo repository GitHub
4. Seleziona il repository `scrape-copy-strateco`

### Step 3: Configurazione del servizio
- **Name**: `scrape-copy-strateco`
- **Environment**: `Node`
- **Region**: `Frankfurt` (più vicina all'Europa)
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free` (per iniziare)

### Step 4: Variabili d'ambiente
Aggiungi queste variabili in "Environment":
```
NODE_ENV=production
PORT=10000
```

### Step 5: Deploy
Clicca "Create Web Service" e aspetta il deployment!

## 🔧 Opzione 2: Deploy diretto (Upload ZIP)

### Step 1: Preparare il pacchetto
```bash
# Comprimi la directory del progetto (escludendo node_modules)
cd ..
zip -r scrape-copy-strateco.zip scrape-copy-strateco/ -x "scrape-copy-strateco/node_modules/*"
```

### Step 2: Upload su Render
1. Vai su https://render.com
2. "New +" → "Web Service"
3. Seleziona "Deploy an existing image or build from source code"
4. "Upload from computer" e seleziona lo ZIP

### Step 3: Stessa configurazione dell'Opzione 1

## ✅ Verifica del deployment

Una volta completato il deploy, dovresti vedere:

```
🚀 Server scrape-copy-strateco in esecuzione sulla porta 10000
📝 Interfaccia web: https://TUO-APP-NAME.onrender.com
🔗 API endpoint: POST https://TUO-APP-NAME.onrender.com/scrape-copy-example
```

### Test dell'API:
```bash
curl -X POST https://TUO-APP-NAME.onrender.com/health

curl -X POST https://TUO-APP-NAME.onrender.com/scrape-copy-example \
  -H "Content-Type: application/json" \
  -d '{"query": "headline dentista"}'
```

## 🐛 Troubleshooting

### App non si avvia
- Controlla i logs in Render Dashboard
- Verifica che `npm start` funzioni localmente
- Controlla che tutte le dipendenze siano in `dependencies` (non `devDependencies`)

### Errori di timeout
- Render ha un timeout di 30 secondi per le richieste
- Lo scraping potrebbe richiedere più tempo
- Considera di implementare cache o timeout più brevi

### Errori 503
- L'app potrebbe essere in sleep mode (piano gratuito)
- Primo caricamento può richiedere 10-30 secondi
- Usa servizi come UptimeRobot per mantenere attiva l'app

## 🔄 Auto-deploy

Con GitHub, ogni push sulla branch `main` farà automaticamente un nuovo deploy!

## 💰 Piano gratuito vs Pro

### Piano gratuito:
- ✅ 750 ore/mese compute time
- ✅ Auto-sleep dopo 15 minuti di inattività
- ✅ Subdominio .onrender.com
- ❌ No custom domain
- ❌ Sleep delays

### Piano Pro ($7/mese):
- ✅ Sempre attivo
- ✅ Domini personalizzati
- ✅ SSL automatico
- ✅ Più risorse

## 🌐 URL finali

Dopo il deploy, le tue API saranno disponibili su:
- **Interfaccia web**: `https://scrape-copy-strateco.onrender.com`
- **API principale**: `POST https://scrape-copy-strateco.onrender.com/scrape-copy-example`
- **Health check**: `GET https://scrape-copy-strateco.onrender.com/health`
- **Sources**: `GET https://scrape-copy-strateco.onrender.com/sources` 