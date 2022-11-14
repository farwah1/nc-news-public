const { 
    selectTopics,
    selectArticles
 } = require('../models/topics.js')


exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.send(topics.rows)
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.send(articles.rows)
    })
}