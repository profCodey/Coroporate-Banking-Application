const Joi = require("joi");

const mandateSchemas = {
  createMandate: Joi.object().keys({
    name: Joi.string().lowercase().required(),
    minAmount: Joi.number().required(),
    maxAmount: Joi.number().required(),
    authorisers: Joi.array().items(Joi.string().length(24).trim().required()),
    verifier: Joi.string().hex().length(24),
  }),
};

module.exports = mandateSchemas;
