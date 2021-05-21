const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Session', () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
        await connection.seed.run(); 
    }, 10000);

    afterEach(async () => {
        await connection.migrate.rollback();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it('should be able to login as an User', async () => {
        // entrando como User
        const response = await request(app)
            .post('/sessions')
            .send({
                email: 'teste@teste.com.br',
                password: '123456789'
            });
        expect(response.body).toHaveProperty("expire_at")
        expect(response.body).toHaveProperty("name")
    });
});