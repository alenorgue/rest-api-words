// app.js
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const lodash = require("lodash");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Cargar palabras desde archivo
const words = require("./data/words.json");

// Middleware
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Endpoints

// Iteración 1

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
    return res.json(word);
  }

  res.json(word);
});
// Iteración 3

// Iteración 4


// 404 para rutas no existentes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
