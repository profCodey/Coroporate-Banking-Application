const Joi = require("joi");

const interbankTransferSchemas = {
  createInterbankTransfer: Joi.object().keys({
    Amount: Joi.string().lowercase().required(),
    AppzoneAccount: Joi.string().lowercase(),
    Payer: Joi.string().lowercase().required(),
    PayerAccountNumber: Joi.string().lowercase().required(),
    ReceiverAccountNumber: Joi.string().lowercase().required(),
    ReceiverAccountType: Joi.string().lowercase().required(),
    ReceiverBankCode: Joi.string().lowercase().required(),
    ReceiverPhoneNumber: Joi.string().lowercase().required(),
    ReceiverName: Joi.string().lowercase().required(),
    ReceiverBVN: Joi.string().lowercase().required(),
    ReceiverKYC: Joi.string().lowercase().required(),
    Narration: Joi.string().lowercase(),
    TransactionReference: Joi.string().lowercase().required(),
    NIPSessionID: Joi.string().lowercase().required(),
  }),
};

module.exports = interbankTransferSchemas;
