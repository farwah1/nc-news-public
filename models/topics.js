const db = require('../db/connection.js');

exports.selectTopics = () => {
    return db 
    .query(`SELECT * FROM topics;`)
}

exports.selectArticleByArticleId = (article_id) => {
    return db 
    .query(`SELECT articles.* FROM articles
     WHERE article_id = $1;`, [article_id])
}