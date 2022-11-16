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
    })
    .catch((err) => {
        if (err.code === '22P02') {
            return Promise.reject({
                status: 400,
                msg: 'invalid id'
            });
        };
    });
};

exports.checkUserExists = (username) => {
    return db 
    .query(`SELECT * FROM users
     WHERE username = $1;`, [username])
    .then((user) => {
        if (user.rows.length < 1) {
            return Promise.reject({
                status: 404,
                msg: 'user does not exist'
            })
        } else {
            return user.rows[0]
        }
    });
}
