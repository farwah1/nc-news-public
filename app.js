const express = require('express');
const app = express();
app.use(express.json());

const {
  getTopics,
  getArticles
} = require('./controllers/topics.js');


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);


module.exports = app;