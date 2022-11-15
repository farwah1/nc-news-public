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
            expect(body.length).toBeGreaterThan(0)
            body.forEach(slug => {
                expect(slug).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    });
});

describe('/api/articles', () => {
    test('GET request responds with an array of article objects', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(( { body }) => {
            expect(body.length).toBeGreaterThan(0)
            body.forEach(article => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)

                })
            })
        })
    });
});

describe('/api/articles/:article_id/comments', () => {
    test('GET request responds with 200 status and an array of comments for the given article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(( { body }) => {
            expect(body.comments.length).toBeGreaterThan(0)
            body.comments.forEach(comment => {
                expect(comment).toMatchObject({
                    article_id: 1,
                    comment_id: expect.any(Number),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    body: expect.any(String)
                })
            })
            expect(body.comments).toBeSortedBy('created_at', {descending: true})
        })
    });

    test('GET requests responds with 400 status and error message for an invalid id ', () => {
        return request(app)
        .get('/api/articles/woof/comments')
        .expect(400)
        .then(( { body }) => {
            expect(body.msg).toBe('Invalid id')
        })
    });


    test('GET requests responds with 404 status and error message for a valid id that does not exist', () => {
        return request(app)
        .get('/api/articles/1234/comments')
        .expect(404)
        .then(( { body }) => {
            expect(body.msg).toBe('article id does not exist')
        })
    });
});