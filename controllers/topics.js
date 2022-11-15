const { 
    selectTopics,
    selectArticles,
    selectCommentsByArticleId
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

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}
