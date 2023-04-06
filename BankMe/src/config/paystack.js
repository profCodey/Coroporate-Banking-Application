// register api endpoints here

const config = {
  secret_key: process.env.PAYSTACK_SECRET,
  bank_list: "https://api.paystack.co/bank",
  resolve_account : "https://api.paystack.co/bank/resolve",
}

module.exports = config;