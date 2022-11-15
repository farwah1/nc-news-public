const db = require('../connection.js')

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.getArticlesByArticleID = (article_id) => {
  return db 
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((articles) => {
      if (articles.rows.length < 1) {
        return Promise.reject({ status: 404, msg: 'article id does not exist'})
      } else {
        return articles.rows
      }
    })
}