const { selectTopics,
    selectArticleByArticleId } = require('../models/topics.js')


exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.send(topics.rows)
    })
    .catch((error) => {
        next(error)
    })
}

exports.getArticleByArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectArticleByArticleId(article_id)
    .then((article) => {
        res.send(article.rows[0])
    })
    .catch((error) => {
        next(error)
    })
}