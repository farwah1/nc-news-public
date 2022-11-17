const db = require('./connection.js')

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
