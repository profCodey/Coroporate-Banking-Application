const config = require("../config/paystack");
const axios = require("axios");

class PaystackService {
  async getBankList() {
    try {
      const { data } = await axios.get(config.bank_list);
      return data;
    } catch (error) {
      return null;
    }
  }
  async resolveAccount(params) {
    try {
      const { data } = await axios.get(config.resolve_account, {
        params,
        headers: {
          Authorization: `Bearer ${config.secret_key}`,
        },
      });
      return data;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new PaystackService();
