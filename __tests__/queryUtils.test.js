const { checkArticleExists,
        checkUserExists } = require('../db/queryUtils.js')

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

    test('if username does not exist responds with 404', async () => {
        await checkUserExists('meow')
        .then(() => {  
        })
        .catch((err) => {
            expect(err.msg).toBe('user does not exist');
        });
    });
});