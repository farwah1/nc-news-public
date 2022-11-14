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