const { checkArticleExists,
        checkUserExists } = require('../db/queryUtils.js')

describe('checkArticleExists', () => {
    test('function checks is article exists', async () => {
        await checkArticleExists(1)
        .then((article) => {
            expect(article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(Object),
                votes: 100,
            })
        });
    });

    test('if valid id but article does not exist responds with 404 error', async () => {
        await checkArticleExists(12345)
        .then(() => {
        })
        .catch((err) => {
            expect(err.msg).toBe('article id does not exist')
        })
    });

    test('if invalid id responds with 400 error', async () => {
        await checkArticleExists('meow')
        .then(() => {
        })
        .catch((err) => {
            expect(err.msg).toBe('invalid id');
        })
    });
});


describe('checkUserExists', () => {
    test('function checks if username is in users table', async () => {
        await checkUserExists('rogersop')
        .then((user) => {
            expect(user).toMatchObject({
                username: 'rogersop',
                name: 'paul',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
            });
        });
    });

    test('if username does not exist responds with 400', async () => {
        await checkArticleExists(1)
        .then(() => {  
        })
        .catch((err) => {
            expect(err.msg).toBe('user does not exist');
        });
    });
});