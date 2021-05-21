const { Segments, Joi } = require('celebrate');

const updateAccountValidation = {
    [Segments.HEADERS]: Joi.object({
        cookie: Joi.string().required(),
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        cpf: Joi.string().required(),
        whatsapp: Joi.string().required().min(10).max(11),
        city: Joi.string().required(),
        uf: Joi.string().length(2),
    }),
};

module.exports = updateAccountValidation;