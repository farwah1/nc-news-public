const db = require('../db/connection.js');
const users = require('../db/data/test-data/users.js');

exports.selectTopics = () => {
    return db 
    .query(`SELECT * FROM topics;`)
}

exports.selectArticleByArticleId = (article_id) => {
    return db 
    .query(`SELECT articles.* FROM articles
     WHERE article_id = $1;`, [article_id])
}