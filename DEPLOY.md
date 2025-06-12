# 🚀 Guida al deployment su Render per @jacopomatteuzzi

## 📋 Prerequisiti

1. ✅ Account Render (gratuito): https://render.com
2. ✅ Repository GitHub configurato

## 🔧 Deploy da GitHub (Setup completo)

### Step 1: Creare il repository su GitHub
1. Vai su https://github.com/jacopomatteuzzi
2. Clicca "New repository" (+ verde in alto a destra)
3. **Nome repository**: `scrape-copy-strateco`
4. **Descrizione**: `Micro API per copywriting AI - esempi reali di copy`
5. Seleziona **Public** (necessario per piano gratuito Render)
6. **NON** inizializzare con README (abbiamo già tutto)
7. Clicca "Create repository"

### Step 2: Push del codice (ESEGUI QUESTI COMANDI)
```bash
# Sei già nella directory corretta
git push -u origin main
```

Se richiede credenziali GitHub:
- **Username**: jacopomatteuzzi
- **Password**: Usa un Personal Access Token (non la password normale)

### Step 3: Configurare Render
1. Vai su https://render.com e registrati/accedi
2. Clicca "New +" → "Web Service"
3. Seleziona "Connect from GitHub"
4. Autorizza Render ad accedere ai tuoi repository
5. Seleziona il repository `jacopomatteuzzi/scrape-copy-strateco`

### Step 4: Configurazione del servizio
- **Name**: `scrape-copy-strateco`
- **Environment**: `Node`
- **Region**: `Frankfurt` (più vicina all'Europa)
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

### Step 5: Variabili d'ambiente
Clicca "Advanced" e aggiungi:
```
NODE_ENV=production
```
(PORT viene gestito automaticamente da Render)

### Step 6: Deploy!
Clicca "Create Web Service" → Aspetta 2-5 minuti per il build

## ✅ URLs finali

Dopo il deployment, la tua API sarà disponibile su:
- **URL principale**: `https://scrape-copy-strateco.onrender.com`
- **Interfaccia web**: `https://scrape-copy-strateco.onrender.com`
- **API endpoint**: `POST https://scrape-copy-strateco.onrender.com/scrape-copy-example`
- **Health check**: `GET https://scrape-copy-strateco.onrender.com/health`

## 🧪 Test post-deployment

```bash
# Health check
curl https://scrape-copy-strateco.onrender.com/health

# Test API
curl -X POST https://scrape-copy-strateco.onrender.com/scrape-copy-example \
  -H "Content-Type: application/json" \
  -d '{"query": "headline dentista"}'

# Visualizza interfaccia web
open https://scrape-copy-strateco.onrender.com
```

## 🔄 Auto-deploy configurato!

Ogni volta che fai `git push origin main`, Render farà automaticamente un nuovo deploy! 🎉

## 🐛 Troubleshooting

### Repository non trovato
- Verifica che il repository sia **pubblico**
- Controlla che il nome sia esatto: `scrape-copy-strateco`

### Build fallisce
- Controlla i logs nel dashboard Render
- Verifica che `package.json` sia nella root del repository

### App va in sleep
- Piano gratuito: dorme dopo 15 minuti di inattività
- Prima richiesta dopo sleep: 10-30 secondi per "svegliarsi"
- Soluzione: upgrade a piano Pro ($7/mese) o usa servizi keep-alive

## 💡 Consigli per uso professionale

1. **Custom domain**: Aggiungi dominio personalizzato nel piano Pro
2. **Monitoring**: Configura notifiche per errori
3. **Cache**: Considera implementazione di cache Redis per migliorare performance
4. **Rate limiting**: Aggiungi limitazioni per evitare abusi

---

🎯 **Repository GitHub**: https://github.com/jacopomatteuzzi/scrape-copy-strateco
🚀 **Dashboard Render**: https://dashboard.render.com 