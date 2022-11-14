const express = require('express');
const app = express();
app.use(express.json());

const {
  getTopics,
  getArticleByArticleId
} = require('./controllers/topics.js');


app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleByArticleId);

module.exports = app;