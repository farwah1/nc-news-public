const express = require('express');
const app = express();
app.use(express.json());

const {
  getTopics
} = require('./controllers/topics.js');


app.get('/api/topics', getTopics);


module.exports = app;