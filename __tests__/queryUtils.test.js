const db = require('../db/connection.js');
const request = require('supertest');
const app = require('../app.js');

describe('checkArticleExists', () => {
    test('GET request returns article object if article exists', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(( { body }) => {
            expect(body.article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 100,
            })
        });
    });

    test('GET request responds with 404 error if valid article_id does not exist', () => {
        return request(app)
        .get('/api/articles/12345')
        .expect(404)
        .then(( { body }) => {
            expect(body.msg).toBe('article id does not exist')
        });
    });

    test('GET request responds with 400 if invalid article_id', () => {
        return request(app)
        .get('/api/articles/meow')
        .expect(400)
        .then(( { body }) => {
            expect(body.msg).toBe('invalid id')
        });
    });
});