const express = require('express');
const app = express();
app.use(express.json());

const {
  getTopics
} = require('./controllers/topics.js');


app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

module.exports = app;