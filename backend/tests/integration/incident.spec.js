const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Incidents', () => {
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

    it('should be able to show all incidents', async () => {
  
        await request(app)
            .get('/incidents')
            .then((response) => {
                expect(response.body[0]).toHaveProperty("id", 1);
                expect(response.body[0]).toHaveProperty("codigo_promo", "2");
                expect(response.body[0]).toHaveProperty("title", "Lorem ipsum dolor sit");
                expect(response.body[0]).toHaveProperty("description", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatem error itaque eum assumenda cumque ullam cupiditate quod, libero veritatis id consequatur dignissimos facilis quae tenetur alias temporibus esse numquam!");
                expect(response.body[0]).toHaveProperty("value", 999);
                expect(response.body[0]).toHaveProperty("users_id", 1);
                expect(response.body[0]).toHaveProperty("name", 'Teste');
                expect(response.body[0]).toHaveProperty("email", "teste@teste.com.br");
                expect(response.body[0]).toHaveProperty("whatsapp", "3123123123");
                expect(response.body[0]).toHaveProperty("city", "Rio de Janeiro");
                expect(response.body[0]).toHaveProperty("uf", "RJ");
                expect(response.body[0]).toHaveProperty("created_at");
                expect(response.body[0]).toHaveProperty("updated_at");
            })
    });

    it('should be able to create a new incident', async () => {
        const createIncidentResponse = await request(app)
            .post('/incidents')
            .set({ 'Cookie': cookie })
            .send({
                // a id gerada na criação do incident no SEED
                codigo_promo: "2",
                title: "Lorem ipsum dolor sit 2",
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatem error itaque eum assumenda cumque ullam cupiditate quod, libero veritatis id consequatur dignissimos facilis quae tenetur alias temporibus esse numquam!",
                value: 999,
                // a id gerada na criação da User no SEED
                users_id: 1,
                // a key gerada na criação da User no SEED
                name: "Teste",
                email: "Teste@Teste.com.br",
                whatsapp: "3123123123",
                city: "Rio de Janeiro",
                uf: "RJ"
            })
        expect(typeof createIncidentResponse.body === 'number');
        expect(typeof createIncidentResponse.body === 1);
    });

    it('should be able to delete an incident', async () => {
        const deleteIncidentResponse = await request(app)
            .delete('/incidents/1')
            .set({ 'Cookie': cookie });
        expect(deleteIncidentResponse.status).toBe(204);
    });
});