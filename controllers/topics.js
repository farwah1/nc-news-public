const { 
    selectTopics,
    selectArticles,
    selectArticleByArticleId,
    selectCommentsByArticleId,
    addComment,
    updateArticle,
    selectUsers,
    removeComment
 } = require('../models/topics.js')


exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((slugs) => {
        res.send({ slugs });
    });
};

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.send(articles.rows);
    });
};


exports.getArticleByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleByArticleId(article_id)
    .then((article) => {
        res.send({ article });
    })
    .catch((error) => {
        next(error);
    });
};


exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.send({ comments });
    })
    .catch((err) => {
        next(err);
    });
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    addComment(article_id, username, body)
    .then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((error) => {
        next(error)
    })
};

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes  } = req.body;
    updateArticle(article_id, inc_votes)
    .then((article) => {
        res.status(202).send({ article })
    })
    .catch((error) => {
        next(error)
    })
};

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({ users })
    })
    .catch((error) => {
        next(error)
    })
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    removeComment(comment_id)
    .then((comment) => {
        console.log({ comment }, '<controller')
        res.status(204).send('here')
    })
    .catch((error) => {
        next(error)
    })
}

