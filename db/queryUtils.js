const db = require('./connection.js')

exports.checkArticleExists = (article_id) => {
    return db 
    .query(`SELECT * FROM articles
     WHERE article_id = $1;`, [article_id])
    .then((article) => {
        if (article.rows.length < 1) {
            return Promise.reject({
                status: 404,
                msg: 'article id does not exist'
            })
        } else {
            return article.rows[0]
        }
    });
}