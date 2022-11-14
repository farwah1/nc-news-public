const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const app = require('../app.js');
const request = require('supertest');
const testData = require('../db/data/test-data/index.js')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end();
});

describe('/api/topics', () => {
    test('GET request responds with an array of topic objects, each of which has slug and description properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(( { body }) => {
            body.forEach(slug => {
                expect(slug).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    });
});

describe('/api/articles/:article_id', () => {
    test('GET request responds with an array of topic objects, each of which has slug and description properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(( { body }) => {
            expect(body.article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 1,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number)
            })
        })
    });

    test('GET request responds with 404 if article not found', () => {
        return request(app)
        .get('/api/articles/120')
        .expect(404)
        .then(( { body }) => {
            expect(body.msg).toBe('Article not found!')
        });
    });

    test('GET request responds with 400 if article id is invalid', () => {
        return request(app)
        .get('/api/articles/meow')
        .expect(400)
        .then(( { body }) => {
            expect(body.msg).toBe('Invalid id')
        }) 
    });
});
