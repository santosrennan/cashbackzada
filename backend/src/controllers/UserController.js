const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const connection = require('../database/connection');

const config = require('../config');

//TO-DO COLOCAR LOGICA DE NEGOCIO DOS CONTROLLERS NOS SERVICES

module.exports = {
    async index(request, response) {
        const users = await connection('users').select('*');
    
        return response.json(users);
    },
    
    async create(request, response) {
        const { name, email, cpf, whatsapp, city, uf, password } = request.body;
        
        let user = await connection('users')
            .select(['name', 'password'])
            .where('email', email)
            .first();
        
        if(user) {
            return response.status(400).json({
                error: 'User exist',
                message: 'This user already exist.'
            });
        }

        const created_at = new Date().toISOString().slice(0, 19).replace('T', ' '); 
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const hash = bcrypt.hashSync(password, 10);

        await connection('users').insert({
            name,
            email,
            cpf,
            whatsapp,
            city,
            uf,
            password: hash,
            created_at,
            updated_at
        });

        user = await connection('users')
            .select(['name', 'email'])
            .where('email', email)
            .first();
        
        if (config.smtp.host !== 'host_smtp') {
            try {
                // definindo as informações do smtp
                let transporter = nodemailer.createTransport({
                    host: config.smtp.host,
                    port: config.smtp.port,
                    secure: config.smtp.secure, // true for 465, false for other ports
                    auth: {
                    user: config.smtp.auth.user, // generated ethereal user
                    pass: config.smtp.auth.password // generated ethereal password
                    }
                });

                // envia o email
                await transporter.sendMail({
                    from: '"Cashbackzada 💪" <cashbackzada@boticario.com.br>', // sender address
                    to: user.email, // list of receivers
                    subject: "Bem vindo! ", // Subject line
                    text: `Seja bem vindo ${user.name}, utilize nossa plataforma.`, // plain text body
                });

            } catch (error) {
                return response.status(500).json({
                    error: 'Not able to send email of registration.',
                    message: error
                });
            }
        }

        const token = jsonwebtoken.sign({
            email: email,
        }, config.token.secret, {
            expiresIn: config.token.expired
        })

        response.cookie('access_token', token, {
            maxAge: 86400000,
            httpOnly: true,
            expires: false,
            // secure: true // somente para produção
        });

        let date = new Date();
        
        return response.json({
            expire_at: date.setDate(date.getDate() + 1),
            name:   user.name,
            email: config.smtp.host !== 'host_smtp' ? true : false
        });
    },

    async show(request, response) {

        const user_key = request.headers.authorization;
        
        const user = await connection('users')
            .select([
                'name',
                'email',
                'cpf',
                'whatsapp',
                'city',
                'uf',
            ])
            .where('email', request.user.email)
            .first();

        if (!user) {
            return response.status(401).json({
                error: 'Not authorized.'
            });
        }

        return response.json(user);
    },

    async update(request, response) {
        
        const { name, email, cpf, whatsapp, city, uf } = request.body;
        
        const user = await connection('users')
            .select('id')
            .where('email', request.user.email)
            .first();

        if (!user) {
            return response.status(401).json({
                error: 'Not authorized.'
            });
        }

        try {
            const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

            await connection('users')
                .where('email', request.user.email)
                .update({
                    name,
                    email,
                    cpf,
                    whatsapp,
                    city,
                    uf,
                    updated_at
                });
        } catch (error) {
            return response.status(400).json({
                error: 'Error while UPDATING.',
                message: error,
            });
        }

        const userUpdated = await connection('users')
            .select('name')
            .where('email', request.user.email)
            .first();

        return response.json(userUpdated.name);
    },

    async delete(request, response) {
        
        const user = await connection('users')
            .where('email', request.user.email)
            .first();

        if (!user) {
            return response.status(401).json({
                error: 'Not authorized.'
            });
        }

        try {
            await connection('users')
                .where('id', user.id)
                .delete();
        } catch (error) {
            return response.status(400).json({
                error: 'Error while DELETING.',
                message: error,
            });
        }

        return response.status(204).send();
    }
}