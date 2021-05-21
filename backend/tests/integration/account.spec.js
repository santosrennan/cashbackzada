const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Account', () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
        await connection.seed.run(); 

        // fazendo login para obter o cookie nos requests futuros
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

    it('should be able to get the data', async () => {
        // listando dados
        await request(app)
            .get('/account')
            .set('Cookie', cookie)
            .then((response) => {
                expect(response.body).toHaveProperty("name", "João");
                expect(response.body).toHaveProperty("email", "João@teste.com.br");
                expect(response.body).toHaveProperty("cpf", "17376732748");
                expect(response.body).toHaveProperty("whatsapp", "3123123123");
                expect(response.body).toHaveProperty("city", "Rio de Janeiro");
                expect(response.body).toHaveProperty("uf", "RJ");
            });
    });

    it('should be able to update the data of the User', async () => {
        // atualizando informações da User
        await request(app)
            .put('/account')
            .set('Cookie', cookie)
            .send(
                {
                    name: "NOVO NOME",
                    email: "NOVONOME@teste.com.br",
                    whatsapp: "99999999999",
                    city: "Rio de Janeiro",
                    uf: "RJ"
                }
            ).then((response) => {
                expect(typeof response.body === 'NOVO NOME');
            });
    });
});