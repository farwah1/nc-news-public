const db = require('../db/connection.js');

exports.selectTopics = () => {
    return db 
    .query(`SELECT * FROM topics;`)
    .then((slugs) => {
        return slugs.rows
    })
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

