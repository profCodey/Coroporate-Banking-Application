const Joi = require("joi");


const validateAccount = (account) => (payload) =>
  account.validate(payload, { abortEarly: false });
const accountSchema = Joi.object()
  .keys({
    accountImageUrl: Joi.string(),
    address: Joi.string().required(),
    password: Joi.string().min(8).required().label("Password"),
    confirm_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  })
  .with("password", "confirm_password");

exports.validateAccountSignup = validateAccount(accountSchema);



const validateChangePassword = (user) => (payload) =>
  user.validate(payload, { abortEarly: false });
const changePasswordSchema = Joi.object()
  .keys({
    old_password: Joi.string().min(8).required().label("Old Password"),
    password: Joi.string().min(8).required().label("Password"),
    confirm_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" })
  })
exports.validateChangePasswordSchema =
  validateChangePassword(changePasswordSchema);

const validateMandate = (mandate) => (payload) =>
  mandate.validate(payload, { abortEarly: false });
const mandateSchema = Joi.object().keys({
  name: Joi.string().lowercase().required(),
  minAmount: Joi.number().required(),
  maxAmount: Joi.number().required(),
  authorisers: Joi.array().items(Joi.string().length(24).trim().required()),
  verifier: Joi.array().items(Joi.string().length(24).trim()),
});
exports.validateMandateSchema = validateMandate(mandateSchema);


const updateMandate = (mandate) => (payload) =>
  mandate.validate(payload, { abortEarly: false });
const updatemandateSchema = Joi.object().keys({
  name: Joi.string().lowercase(),
  minAmount: Joi.number(),
  maxAmount: Joi.number(),
  authorisers: Joi.array().items(Joi.string().length(24).trim()),
  verifier: Joi.array().items(Joi.string().length(24).trim()),
});
exports.validateUpdateMandateSchema = updateMandate(updatemandateSchema);


//USER SCHEMA
const validateRequest = (user) => (payload) =>
  user.validate(payload, { abortEarly: false });
const initiateRequestSchema = Joi.object().keys({
  customerName: Joi.string().min(3).max(60).lowercase().required(),
  amount: Joi.number().required(),
  bankName: Joi.string().required(),
  accountNumber: Joi.string().length(10).required(),
  accountName: Joi.string().min(3).max(60).lowercase().required(),
});
exports.validateInitiateRequestSchema = validateRequest(initiateRequestSchema);


const getDateAndTime = () => {
  const dt = new Date(new Date().toISOString());
  const date = dt.toString().slice(0, 15);
  const time = dt.toString().slice(16, 21);

  return { date, time };
};

module.exports = {
  getDateAndTime,
};