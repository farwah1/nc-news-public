const express = require('express');
const app = express();
app.use(express.json());

const {
  getTopics,
  getArticles,
  getArticleByArticleId,
} = require('./controllers/topics.js');


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleByArticleId);


app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg })
  } else {
    next(err)
  }
});


app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid id' })
  } else {
    next(err)
  }
});


app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: 'Internal server error' });
});


module.exports = app;