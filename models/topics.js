const db = require('../db/connection.js');

exports.selectTopics = () => {
    return db 
    .query('SELECT * FROM topics;')
}

exports.selectArticles = () => {
    return db 
    .query(`SELECT articles.author, articles.title,
    articles.article_id, articles.topic,
    articles.created_at, articles.votes,
     (comments.article_id) comment_count
            FROM articles
            JOIN users ON users.username = articles.author
            JOIN comments ON comments.article_id = articles.article_id
            ORDER BY created_at DESC;`)
}