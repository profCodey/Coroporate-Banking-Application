const Joi = require("joi");

const authSchemas = {
  login: Joi.object().keys({
    email: Joi.string().min(6).max(40).trim().lowercase().required().email(),
    password: Joi.string().min(8).required().label("Password"),
  }),

  forgetPassword: Joi.object().keys({
    email: Joi.string().min(6).max(40).trim().lowercase().required().email(),
  }),

  verifyUser: Joi.object().keys({
    token: Joi.string().required(),
  }),

  resetPassword: Joi.object()
    .keys({
      password: Joi.string().min(8).required().label("Password"),
      confirm_password: Joi.any()
        .equal(Joi.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),
      token: Joi.string(),
    })
    .with("password", "confirm_password"),

  register: Joi.object()
    .keys({
      firstName: Joi.string().min(3).max(20).lowercase().required(),
      lastName: Joi.string().min(3).max(20).lowercase().required(),
      email: Joi.string().min(6).max(40).trim().lowercase().required().email(),
      password: Joi.string().min(8).required().label("Password"),
      confirm_password: Joi.any()
        .equal(Joi.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),
      designation: Joi.string().required(),
      secrets: Joi.array().items(Joi.object().required()),
      phone: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
      gender: Joi.string().required(),
      organizationId: Joi.string().required(),
      imageUrl: Joi.string(),
      privileges: Joi.array().items(Joi.string().required()),
    })
    .with("password", "confirm_password"),
};

module.exports = authSchemas;
