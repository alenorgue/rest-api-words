// app.js
const express = require("express");
const morgan = require("morgan");
const fs = require('fs').promises;
const path = require("path");
const lodash = require("lodash");
require("dotenv").config();
const nodeFetch = require("node-fetch"); 
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Cargar palabras desde archivo
const words = require("./data/words.json");
const languages = ["zh", "pt-br", "es", "de", "it", "fr"];

// Middleware
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Endpoints

// (Bonus 2)
app.get('/api/v1/words/all', (req, res) => {
 
  res.json({ words });
});
// (Bonus 3)
app.get('/api/v1/words/:index', (req, res) => {
const index = parseInt(req.params.index, 10);

if (isNaN(index) || index < 0 || index >= words.length) {
  return res.status(404).json({ error: "Índice fuera de rango" });
}
res.json({ word: words[index] });
  res.json({ words });
});

// Iteración 2
app.get('/api/v1/words', (req, res) => {
  const length = parseInt(req.query.length);
  const word = lodash.sample(words);

  if (length) {
    const filteredWords = words.filter(word => word.length === length);
    const word = lodash.sample(filteredWords);
    if (filteredWords.length === 0) {
      return res.status(404).json({ error: 'No hay palabras con esa longitud' });
    }
    res.json({ word });
  }

  res.json({ word });
});
// Iteración 3
app.get('/api/v2/languages', (req, res) => {
  
  res.json({ languages });
});
// Iteración 4
app.get('/api/v2/words', async (req, res) => {
  const { length, lang } = req.query;


  if (length && (isNaN(length) || length < 1)) {
    return res.status(400).json({
      error: "El parámetro 'length' debe ser un número mayor a 0 si se proporciona"
    });
  }

if (lang && !languages.includes(lang)) {
    return res.status(400).json({
      error: "Idioma no soportado. Consulta los idiomas válidos en /api/v2/languages"
    });
  }

try {
  let wordsFilePath = path.join(__dirname, 'data', 'words.json');


   let apiUrl = 'https://random-word-api.herokuapp.com/word';

    if (length) apiUrl += `?length=${length}&`;
    if (lang) apiUrl += `lang=${lang}&`;
    const response = await nodeFetch(apiUrl);
    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No se encontró palabra" });
    }
  // Guardar palabra nueva si no existe ya en words.json
  if (data && data.length > 0) {
    const newWord = data[0];
    if (!words.includes(newWord)) {
      words.push(newWord);
      try {
        await fs.writeFile(wordsFilePath, JSON.stringify(words, null, 2), 'utf-8');
      } catch (err) {
        console.error('Error al guardar la nueva palabra:', err.message);
      }
    }
  }
    res.json({ word: lodash.sample(data) }); 
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener palabra desde la API externa" });
  }
});

// 404 para rutas no existentes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
