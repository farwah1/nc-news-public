const express = require('express');
const app = express();
app.use(express.json());

const {
  getTopics,
  getArticles,
  getCommentsByArticleId
} = require('./controllers/topics.js');


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);


module.exports = app;