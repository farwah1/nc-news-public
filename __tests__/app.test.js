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
            expect(body.slugs.length).toBeGreaterThan(0)
            body.slugs.forEach(slug => {
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




describe('/api/articles/:article_id', () => {
    test('GET request responds with an object containing article object', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(( { body }) => {
            expect(body.article).toMatchObject({
                author: 'butter_bridge',
                title: 'Living in the shadow of a great man',
                article_id: 1,
                body: 'I find this existence challenging',
                topic:'mitch',
                created_at: expect.any(String),
                votes: 100
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


describe('/api/articles/:article_id/comments', () => {
    test('POST request reponds with 201 and the added comment', () => {
        const testComment =   {
            username: 'thebear22',
            body: 'This is awesome!!!'
          }
        return request(app)
        .post('/api/articles/1/comments')
        .send(testComment)
        .expect(201)
        .then(({ body }) => {
            expect(body.addedComment).toMatchObject({
                comment_id: expect.any(Number),
                author: 'thebear22',
                body: 'This is awesome!!!',
                article_id: 1
            })
        })
    });

    test('POST requests body must contain object with username AND body properties', () => {
        const testComment =   {
            username: 'thebear22'
          }
        return request(app)
        .post('/api/articles/1/comments')
        .send(testComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('invalid object')
        });
    });

    test('POST request body object properties should be the correct data type', () => {
        const testComment =   {
            username: 'thebear22',
            body: 12345
          }
        return request(app)
        .post('/api/articles/1/comments')
        .send(testComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('invalid object')
        });
    });
});