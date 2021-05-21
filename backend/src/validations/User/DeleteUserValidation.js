const { Segments, Joi } = require('celebrate');

const deleteUserValidation = {
    [Segments.HEADERS]: Joi.object().keys({
        cookie: Joi.string().required(),
    }).unknown()
};

module.exports = deleteUserValidation;