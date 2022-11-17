const db = require('../db/connection.js');
const { checkUserExists } = require('../db/queryUtils.js')

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
    .query(`SELECT articles.*, count(comments.article_id)::INT AS comment_count 
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
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
            });
    };
};

exports.updateArticle = (article_id, inc_votes) => {
    if (inc_votes === undefined) {
        return Promise.reject({status: 400, msg: 'object invalid format'});
    } else {
        return db 
        .query(`UPDATE articles
        SET votes = votes + $2 WHERE article_id = $1 RETURNING*;`, [article_id, inc_votes])
        .then((updatedArticle) => {
            if (updatedArticle.rows.length < 1) {
                return Promise.reject({status: 404, msg: 'article id does not exist'});
            } else {
                return updatedArticle.rows[0]
            }
        });
    };
};


exports.selectUsers = () => {
    return db 
    .query(`SELECT * FROM users;`)
    .then((users) => {
        return users.rows
    })
}

exports.removeComment = (comment_id) => {
    return db 
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*;`, [comment_id])
    .then((deletedComment) => {
        if (deletedComment.rows < 1) {
            return Promise.reject({status: 404, msg: 'comment does not exist'});
        } else {
            return deletedComment.rows[0]
        }
    })
}



