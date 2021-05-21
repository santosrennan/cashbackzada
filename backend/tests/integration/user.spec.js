const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('USER', () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
        await connection.seed.run(); 

        await request(app)
        .post('/sessions')
        .send({
            email: "teste@teste.com.br",
            password: "123456789"
        })
        .expect(200)
        .then(res => {
            cookie = res.headers['set-cookie'][0]
        })
    }, 10000);

    afterEach(async () => {
        await connection.migrate.rollback();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it('should be able to list all USERs', async () => {
       
        // listando todos Users
        await request(app)
            .get('/users')
            .then(response => {
                expect(response.body[0]).toHaveProperty('id', 1);
                expect(response.body[0]).toHaveProperty('name', "Teste");
                expect(response.body[0]).toHaveProperty('email', "teste@teste.com.br");
                expect(response.body[0]).toHaveProperty("cpf", "17376732748");
                expect(response.body[0]).toHaveProperty('whatsapp', "3123123123");
                expect(response.body[0]).toHaveProperty('city', "Rio de Janeiro");
                expect(response.body[0]).toHaveProperty('uf', "RJ");

            });
    });
    
    it('should be able to create a new User', async () => {
        // criando um User
        await request(app)
            .post('/users')
            .send({
                name: "Joao",
                email: "Joao@teste.com.br",
                whatsapp: "21998002308",
                city: "Rio de Janeiro",
                uf: "RJ",
                password: "123456789"
            })
            .then(response => {
                expect(response.body).toHaveProperty('name', "Joao");
                expect(response.body).toHaveProperty('expire_at');
            });
    });

    it('should be able to delete the User', async () => {
        // deletando o User passando o cabeçalho de authorization com a key
        await request(app)
            .delete('/users')
            .set({ 'Cookie': cookie })
            .then(response => {
                expect(response.status).toBe(204);
            });
    });
});