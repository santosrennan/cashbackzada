const connection = require('../database/connection');
//TO-DO COLOCAR LOGICA DE NEGOCIO DOS CONTROLLERS NOS SERVICES
module.exports = {
    async index(request, response) {
        const { page = 1 } = request.query;
        const user = await connection('users')
            .where('email', request.user.email)
            .first();

        if (!user) {
            return response.status(401).json({
                error: 'Not authorized.'
            });
        }

        const [count] = await connection('incidents')
            .where('users_id', user.id)
            .count();

        const incidents = await connection('incidents')
            .limit(6)
            .offset((page - 1) * 6)
            .select('*')
            .where('users_id', user.id);
    
        response.header('X-Total-Count', count['count(*)']);
        
        return response.json(incidents);
    },
}