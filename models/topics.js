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
            COUNT(comments.article_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            GROUP BY comments.article_id, articles.author, articles.title, articles.article_id, articles.topic,
            articles.created_at, articles.votes
            ORDER BY created_at DESC;`)
}

exports.selectCommentsByArticleId = (article_id) => {
    return db 
    .query(`SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`, [article_id])
}
