const db = require('../db/connection.js');

exports.selectTopics = () => {
    return db 
    .query(`SELECT * FROM topics;`)
}

exports.selectArticleByArticleId = (article_id) => {
    return db 
    .query(`SELECT articles.* FROM articles
     WHERE article_id = $1;`, [article_id])
    .then((article) => {
        if (article.rows.length < 1) {
            return Promise.reject({
                status: 404,
                msg: 'Article not found!'
            })
        } else {
            return article.rows[0]
        }
    })
}