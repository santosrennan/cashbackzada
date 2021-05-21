const connection = require('../database/connection');
//TO-DO COLOCAR LOGICA DE NEGOCIO DOS CONTROLLERS NOS SERVICES

class IncidentService{
    async index(response,request) {
        const { page = 1 } = request.query;
        
        const [count] = await connection('incidents')
            .count();

        const incidents = await connection('incidents')
            .join('users', 'users.id', '=', 'incidents.users_id')
            .select([
                'incidents.*',
                'users.name',
                'users.email',
                'users.cpf',
                'users.whatsapp',
                'users.city',
                'users.uf',
            ])
            .limit(5)
            .offset((page - 1) * 5);
    
        response.header('X-Total-Count', count['count(*)']);
                console.log("entrei")
        return incidents;
    }

    async create(request, response) {
        const {codigo_promo, title, description, value } = request.body;
        
        const users = await connection('users')
            .select('id')
            .where('email', request.user.email)
            .first();

        if (!users) {
            return response.status(401).json({
                error: 'Not authorized.'
            });
        }

        const [id] = await connection('incidents')
            .insert({
                codigo_promo,
                title,
                description,
                value,
                users_id: users.id
            });

        return response.json({ id });
    }

    async show(request, response) {
        const { id } = request.params;

        const users_id = await connection('users')
            .select('id')
            .where('email', request.user.email)
            .first();

        if (!users_id) {
            return response.status(401).json({
                error: 'Not authorized.'
            });
        }

        const incident = await connection('incidents')
            .where('id', id)
            .select('*')
            .first();

        return response.json(incident);
    }

    async update(request, response) {
        const { id } = request.params;
        const { codigo_promo , title, description, value } = request.body;
        
        const users = await connection('users')
            .select('id')
            .where('email', request.user.email)
            .first();

        if (!users) {
            return response.status(401).json({
                error: 'Not authorized.'
            });
        }

        const userUpdated = await connection('incidents')
            .where('users_id', users.id)
            .where('id', id)
            .update({
                codigo_promo,
                title,
                description,
                value,
            });

        return response.json(userUpdated);
    }

    async delete(request, response) {
        const { id } = request.params;

        const users_id = await connection('users')
            .select('id')
            .where('email', request.user.email)
            .first();

        if (!users_id) {
            return response.status(401).json({
                error: 'Not authorized.'
            });
        }

        const incident = await connection('incidents')
            .where('id', id)
            .select('users_id')
            .first();

        if (incident.users_id !== users_id.id) {
            return response.status(401).json({
                error: 'Operation not permitted.'
            })
        }

        await connection('incidents')
            .where('id', id)
            .delete();

        return response.status(204).send();
    }
}


module.exports = new IncidentService();
  