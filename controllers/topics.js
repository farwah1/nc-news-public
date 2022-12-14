const { readFile } = require('fs/promises')

const { 
    selectTopics,
    selectArticles,
    selectArticleByArticleId,
    selectCommentsByArticleId,
    addComment,
    updateArticle,
    selectUsers,
    removeComment,
    selectCommentByCommentId
 } = require('../models/topics.js')


exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((slugs) => {
        res.send({ slugs });
    });
};

exports.getArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query
    selectArticles(topic, sort_by, order)
    .then((articles) => {
        res.send({articles});
    })
    .catch((err) => {
        next(err)
    })
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
        
        
exports.getCommentByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    selectCommentByCommentId(comment_id)
    .then((comment) => {
        res.send({ comment })
    })
    .catch((error) => {
        next(error)
    })
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    removeComment(comment_id)
    .then(() => {
        res.sendStatus(204)
    })
    .catch((error) => {
        next(error)
    })
}

exports.getApi = (req, res, next) => {
    readFile('./endpoints.json', 'utf8')
    .then((result) => {
        const parsedEndpoints = JSON.parse(result)
        const endpoints = JSON.stringify(parsedEndpoints)
        res.send({ endpoints })
    });
}

