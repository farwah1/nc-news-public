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
        if (article.rows.length < 1) {
            return Promise.reject({
                status: 404,
                msg: 'Article not found!'
            })
        } else {
            article = article.rows[0]
            res.send({ article })
        }
    })
    .catch((error) => {
        next(error)
    })
}