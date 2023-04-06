const paystackService = require("../../services/paystack.service");

const getBankList = async (req, res) => {
  const bankList = await paystackService.getBankList();
  if (!bankList) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank list",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Bank list retrieved successfully",
    data: bankList.data,
  });
};

module.exports = getBankList;
