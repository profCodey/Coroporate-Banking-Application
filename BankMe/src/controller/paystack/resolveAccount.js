const paystackService = require("../../services/paystack.service");

const resolveAccount = async (req, res) => {
  const account = await paystackService.resolveAccount(req.body);
  if(!account) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to resolve account",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: account.message,
    data: account.data,
  });
};

module.exports = resolveAccount;
