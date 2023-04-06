const Joi = require("joi");

const notificationsSchemas = {
  notifications: Joi.object().keys({
    notifications: Joi.array().items(Joi.string().length(24).trim().required()),
  }),
}


module.exports = notificationsSchemas;