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
            expect(body.articles.length).toBeGreaterThan(0)
            body.articles.forEach(article => {
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
                votes: 100,
                comment_count: expect.any(Number)
            })
        })
    });

    test('GET request responds with 404 if article not found', () => {
        return request(app)
        .get('/api/articles/120')
        .expect(404)
        .then(( { body }) => {
            expect(body.msg).toBe('article id does not exist')
        });
    });

    test('GET request responds with 400 if article id is invalid', () => {
        return request(app)
        .get('/api/articles/meow')
        .expect(400)
        .then(( { body }) => {
            expect(body.msg).toBe('invalid input')
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

    test('GET requests responds with 400 status and error message for an invalid input ', () => {
        return request(app)
        .get('/api/articles/woof/comments')
        .expect(400)
        .then(( { body }) => {
            expect(body.msg).toBe('invalid input')
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
            username: 'rogersop',
            body: 'This is awesome!!!'
          }
        return request(app)
        .post('/api/articles/1/comments')
        .send(testComment)
        .expect(201)
        .then(({ body }) => {
            expect(body.comment).toMatchObject({
                comment_id: expect.any(Number),
                author: 'rogersop',
                body: 'This is awesome!!!',
                article_id: 1
            })
        })
    });

    test('POST request reponds with 400 if the user does not exist', () => {
        const testComment =   {
            username: 'thebear22',
            body: 'Lovely'
          }
        return request(app)
        .post('/api/articles/1/comments')
        .send(testComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('user does not exist')
        })
    });


    test('POST requests body must contain object with username AND body properties', () => {
        const testComment =   {
            username: 'rogersop'
          }
        return request(app)
        .post('/api/articles/1/comments')
        .send(testComment)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('missing object properties')
        });
    });


    test('POST requests responds with 400 status and error message for an invalid input ', () => {
        const testComment =   {
            username: 'rogersop',
            body: 'This is awesome!!!'
          }
        return request(app)
        .post('/api/articles/woof/comments')
        .send(testComment)
        .expect(400)
        .then(( { body }) => {
            expect(body.msg).toBe('invalid input')
        })
    });


    test('POST requests responds with 404 status and error message for a valid id that does not exist', () => {
        const testComment =   {
            username: 'rogersop',
            body: 'This is awesome!!!'
          }
        return request(app)
        .post('/api/articles/1234/comments')
        .send(testComment)
        .expect(404)
        .then(( { body }) => {
            expect(body.msg).toBe('article id does not exist')
        })
    });
});

describe('/api/articles/:article_id', () => {
    test('PATCH request responds with 202 with updated article votes', () => {
        const testUpdate = { inc_votes: 1 }
        return request(app)
        .patch('/api/articles/1')
        .send(testUpdate)
        .expect(202)
        .then(( { body }) => {
            expect(body.article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 101,
              })
        })
    });

    test('PATCH request responds with 400 if article id is invalid', () => {
        const testUpdate = { inc_votes: 1 }
        return request(app)
        .patch('/api/articles/rawr')
        .send(testUpdate)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('invalid input')
        });
    });

    test('PATCH request responds with 404 if article id valid but does not exist', () => {
        const testUpdate = { inc_votes: 1 }
        return request(app)
        .patch('/api/articles/12345')
        .send(testUpdate)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('article id does not exist')
        });
    });

    test('PATCH request responds with 400 if body object does not contain votes property', () => {
        const testUpdate = {}
        return request(app)
        .patch('/api/articles/2')
        .send(testUpdate)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('object invalid format')
        });
    });

    test('PATCH request responds with 400 if inc_vote is not a number', () => {
        const testUpdate = { inc_votes: 'meow'}
        return request(app)
        .patch('/api/articles/3')
        .send(testUpdate)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('invalid input')
        });
    });
});



describe('/api/users', () => {
    test('GET request responds with 200 and users object', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            expect(body.users.length).toBeGreaterThan(0)
            body.users.forEach(user => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url:expect.any(String)
                })
            })
        })
    });
});

describe('/api/comments/:comment_id', () => {
    test('GET request responds with 200 and the comment', () => {
        return request(app)
        .get('/api/comments/2')
        .expect(200)
        .then(({ body }) => {
            expect(body.comment).toMatchObject({
                comment_id: 2,
                body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                votes: 14,
                author: "butter_bridge",
                article_id: 1,
                created_at: expect.any(String),
            })
        })
    });

    test('GET request responds with 404 if comment id is valid but does not exist', () => {
        return request(app)
        .get('/api/comments/12345')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('comment does not exist')
        })
    });

    test('GET request responds with 400 if invalid comment_id given', () => {
        return request(app)
        .get('/api/comments/roar')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('invalid input')
        })
    });
});


describe('/api/comments/:comment_id', () => {
    test('DELETE request responds with 204 and the deleted comment and GET request responds with 404 when trying to find said deleted comment', () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
    });

    test('DELETE request responds with 404 if comment id valid but does not exist', () => {
        return request(app)
        .delete('/api/comments/12345')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('comment does not exist')
        })
    });

    test('DELETE request responds with 400 if invalid comment_id given', () => {
        return request(app)
        .delete('/api/comments/roar')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('invalid input')
        })
    })
})

describe('/api/articles queries', () => {
    test('GET request responds with 200 and all articles of one topic', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(( { body }) => {
            body.articles.forEach(article=> {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    topic: 'cats',
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            })
        }) 
    });

    test('GET request responds with 200 and all articles ordered by asc or desc', () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(( { body }) => {
            body.articles.forEach(article=> {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            })
            expect(body.articles).toBeSorted('created_at',{ascending: true})
        }) 
    });

    test('GET request responds with 200 and all articles sorted by a specific column', () => {
        return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(( { body }) => {
            body.articles.forEach(article=> {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            })
            expect(body.articles).toBeSortedBy('votes', {descending: true})
        }) 
    });

    test('GET request responds with 200 and all articles sorted by a specific column and order', () => {
        return request(app)
        .get('/api/articles?sort_by=votes&order=asc')
        .expect(200)
        .then(( { body }) => {
            body.articles.forEach(article=> {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            })
            expect(body.articles).toBeSortedBy('votes', {ascending: true})
        }) 
    });

    test('GET request responds with 400 if sort_by column is not valid', () => {
        return request(app)
        .get('/api/articles?sort_by=moo')
        .expect(400)
        .then(( { body }) => {
            expect(body.msg).toBe('sort_by column not found')
        }) 
    });

    test('GET request responds with 404 if topic does not exist', () => {
        return request(app)
        .get('/api/articles?topic=woof')
        .expect(404)
        .then(( { body }) => {
            expect(body.msg).toBe('topic does not exist')
        }) 
    });

    test('GET request responds with 400 if order is not valid', () => {
        return request(app)
        .get('/api/articles?order=meow')
        .expect(400)
        .then(( { body }) => {
            expect(body.msg).toBe('invalid order query')
        }) 
    })
})

