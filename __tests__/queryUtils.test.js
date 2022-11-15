const {
    getArticlesByArticleID
  } = require('../db/queryUtils.js');
  
describe('Get articles by article_id', () => {
    test('return all articles of the same article_id', () => {
        return getArticlesByArticleID(1)
        .then((articles) => {
            expect(articles[0]).toEqual( {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(Object),
                votes: 100,
              })
        })
    });
});