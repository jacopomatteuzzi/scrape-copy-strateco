const axios = require('axios');
const cheerio = require('cheerio');
const sources = require('./sources.json');

// Funzione per ritardo casuale
const randomDelay = (min = 1000, max = 3000) => {
  return new Promise(resolve => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, delay);
  });
};

// Headers più realistici
const getRandomHeaders = () => {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ];
  
  return {
    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Cache-Control': 'max-age=0'
  };
};

// Database di esempi di fallback
const getMockExample = (query) => {
  const mockExamples = [
    {
      title: "Il Metodo Segreto per Raddoppiare i Tuoi Clienti",
      text: "Scopri la strategia che ha permesso a migliaia di professionisti di aumentare del 200% la loro clientela in soli 90 giorni. Non è magia, è marketing scientifico.",
      category: "business"
    },
    {
      title: "Finalmente! La Soluzione che Stavi Cercando",
      text: "Dopo anni di ricerca, abbiamo sviluppato il sistema più efficace per [inserire beneficio]. I risultati parlano chiaro: 9 persone su 10 vedono miglioramenti già dal primo utilizzo.",
      category: "problem-solution"
    },
    {
      title: "Attenzione: Questa Offerta Scade Tra 24 Ore",
      text: "Non perdere l'opportunità di ottenere [prodotto/servizio] al 50% di sconto. Solo per i primi 100 clienti. Cosa aspetti?",
      category: "urgency"
    },
    {
      title: "Come Ho Trasformato la Mia Vita in 30 Giorni",
      text: "La mia storia personale di come sono passato da [situazione negativa] a [situazione positiva] seguendo questo metodo rivoluzionario. E ora lo insegno a te.",
      category: "transformation"
    },
    {
      title: "Gli Esperti Non Vogliono che Tu Sappia Questo",
      text: "Il segreto nascosto che l'industria non vuole rivelare. Finalmente puoi avere accesso alle stesse strategie usate dai professionisti più pagati al mondo.",
      category: "secrets"
    }
  ];

  // Seleziona un esempio casuale
  const example = mockExamples[Math.floor(Math.random() * mockExamples.length)];
  
  return {
    title: example.title,
    source: "https://scrape-copy-strateco.onrender.com/mock-examples",
    type: 'mock_example',
    image_url: null,
    text: example.text,
    scraped_from: "Fallback Examples Database",
    scraped_at: new Date().toISOString(),
    category: example.category,
    note: `Esempio generato per la query: "${query}". Aggiungi sorgenti reali tramite l'interfaccia web per ottenere esempi dal vivo.`
  };
};

module.exports = async function scrapeExample(query) {
  if (sources.length === 0) {
    console.log('⚠️ Nessuna sorgente configurata, uso esempi mock');
    return getMockExample(query);
  }

  const source = sources[Math.floor(Math.random() * sources.length)]; // Random source
  const searchURL = source.baseUrl + encodeURIComponent(query);

  console.log(`🔍 Tentativo scraping su: ${source.name}`);
  console.log(`🌐 URL: ${searchURL}`);

  try {
    // Ritardo iniziale per sembrare più umani
    await randomDelay(500, 1500);
    
    const { data } = await axios.get(searchURL, {
      headers: getRandomHeaders(),
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: function (status) {
        return status < 500; // Non fallire per 4xx errors
      }
    });
    
    // Controllo se abbiamo ricevuto una pagina di blocco
    if (data.includes('Access denied') || data.includes('blocked') || data.includes('captcha')) {
      throw new Error('Sito protetto da anti-bot - prova con un altro sito');
    }
    
    const $ = cheerio.load(data);
    const results = $(source.resultSelector);
    
    if (results.length === 0) {
      throw new Error(`Nessun risultato trovato per "${query}" su ${source.name}`);
    }

    console.log(`✅ Trovati ${results.length} risultati`);
    
    // Prendiamo un risultato casuale invece del primo
    const randomIndex = Math.floor(Math.random() * Math.min(results.length, 5));
    const selectedResult = results.eq(randomIndex);

    const title = selectedResult.find(source.titleSelector).text().trim();
    let link = selectedResult.find(source.linkSelector).attr('href');
    
    if (!link) {
      throw new Error('Nessun link trovato nel risultato selezionato');
    }

    // Gestisce link relativi
    if (link.startsWith('/')) {
      const baseUrl = new URL(source.baseUrl);
      link = baseUrl.origin + link;
    }

    console.log(`🔗 Accesso alla pagina: ${link}`);
    
    // Altro ritardo prima della seconda richiesta
    await randomDelay(1000, 2500);

    const page = await axios.get(link, {
      headers: getRandomHeaders(),
      timeout: 15000,
      maxRedirects: 5
    });
    
    const $$ = cheerio.load(page.data);
    const text = $$(source.textSelector).text().trim().slice(0, 1500);
    let image = $$(source.imageSelector).attr('src');

    // Gestisce immagini relative
    if (image && image.startsWith('/')) {
      const baseUrl = new URL(link);
      image = baseUrl.origin + image;
    }

    const result = {
      title: title || 'Titolo non disponibile',
      source: link,
      type: 'swipe_example',
      image_url: image || null,
      text: text || 'Testo non trovato',
      scraped_from: source.name,
      scraped_at: new Date().toISOString()
    };

    console.log(`🎯 Scraping completato con successo da ${source.name}`);
    return result;
    
  } catch (error) {
    console.error(`❌ Errore scraping da ${source.name}:`, error.message);
    
    // Se abbiamo più sorgenti, proviamo con la prossima
    if (sources.length > 1) {
      console.log('🔄 Tentativo con sorgente alternativa...');
      // Rimuoviamo temporaneamente la sorgente fallita e riproviamo
      const filteredSources = sources.filter(s => s.name !== source.name);
      if (filteredSources.length > 0) {
        // Salviamo temporaneamente le sorgenti originali
        const originalSources = [...sources];
        sources.splice(0, sources.length, ...filteredSources);
        
        try {
          const result = await scrapeExample(query);
          // Ripristiniamo le sorgenti originali
          sources.splice(0, sources.length, ...originalSources);
          return result;
        } catch (fallbackError) {
          // Ripristiniamo le sorgenti originali
          sources.splice(0, sources.length, ...originalSources);
          console.log('⚠️ Tutte le sorgenti hanno fallito, uso esempio mock');
          return getMockExample(query);
        }
      }
    }
    
    // Fallback finale: restituisci esempio mock
    console.log('⚠️ Scraping fallito, uso esempio mock');
    return getMockExample(query);
  }
}; 