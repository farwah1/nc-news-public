const db = require('../db/connection.js');
const { checkArticleExists,
    checkUserExists } = require('../db/queryUtils.js')

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
                msg: 'article id does not exist'
            })
        } else {
            return article.rows[0]
        }
    });
};

exports.selectCommentsByArticleId = (article_id) => {
    return db 
    .query(`SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`, [article_id])
    .then((comments) => {
        if (comments.rows.length < 1) {
            return Promise.reject({
                status: 404,
                msg: 'article id does not exist'
            })
        } else {
            return comments.rows
        }
    });
};

exports.addComment = (article_id, username, body) => {
    if (!username || !body) {
        return Promise.reject({ status: 400, msg: 'missing object properties' })
    } else {
        return checkArticleExists(article_id)
        .then((res) => {
            if (!res) {
                return Promise.reject({ status: 404, msg: 'article id does not exist' })
            }
            return checkUserExists(username)
            .then(() => {
                return db
                .query(`INSERT INTO comments
                (article_id, author, body)
                VALUES
                ($1, $2, $3) RETURNING*;`, [article_id, username, body])
                .then((addedComment) => {
                    return addedComment.rows[0]
                });
            })
        })
    };
};


