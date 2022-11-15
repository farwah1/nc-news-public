const { 
    selectTopics,
    selectArticles,
    selectArticleByArticleId
 } = require('../models/topics.js')


exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((slugs) => {
        res.send({ slugs })
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.send(articles.rows)
    })
}

exports.getArticleByArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectArticleByArticleId(article_id)
    .then((article) => {
        res.send({ article })
    })
    .catch((error) => {
        next(error)
    })
}