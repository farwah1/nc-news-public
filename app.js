const express = require('express');
const app = express();
app.use(express.json());

const {
  getTopics,
  getArticles,
  getArticleByArticleId,
  getCommentsByArticleId,
  postComment,
  patchArticle,
  getUsers,
  deleteComment,
  getCommentByCommentId
} = require('./controllers/topics.js');


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleByArticleId);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', patchArticle)
app.get('/api/users', getUsers)
app.get('/api/comments/:comment_id', getCommentByCommentId)
app.delete('/api/comments/:comment_id', deleteComment)



app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
  } else {
    next(err)
  }
});


app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'invalid input' })
  } else {
    next(err)
  }
});

app.use((err, req, res, next) => {
  if (err.code === '23503') {
    res.status(404).send({ msg: 'article id does not exist' })
  } else {
    next(err)
  }
});


app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: 'Internal server error' });
});


module.exports = app;