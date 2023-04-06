const Joi = require("joi");

const accountSchemas = {
  createAccount: Joi.object().keys({
    organizationId: Joi.string().max(40).trim().lowercase().required(),
    accountName: Joi.string().max(40).trim().lowercase().required(),
    accountNumber: Joi.string().max(40).trim().lowercase().required(),
    adminId: Joi.string().max(40).trim().lowercase().required(),
    address: Joi.string().max(40).trim().lowercase().required(),
  }),

  verifyAccount: Joi.object()
    .keys({
      secrets: Joi.array().items(Joi.object().required()).required(),
      token: Joi.string().required(),
      password: Joi.string().required(),
      confirm_password: Joi.any()
        .equal(Joi.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),

      token: Joi.string().required(),
    })
    .with("password", "confirm_password"),
};

module.exports = accountSchemas;
