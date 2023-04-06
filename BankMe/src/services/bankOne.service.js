const config = require("../config/bankone");
const axios = require("axios");

class BankOneService {
  async accountByAccountNo(accountNo, authToken) {
    try {
      const { data } = await axios.get(
        `${config.getAccountByAccountNo}?authtoken=${authToken}&accountNumber=${accountNo}`
      );
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async accountByCustomerID(customerId, authToken) {
    try {
      const { data } = await axios.get(
        `${config.getAccountByCustomerID}?authtoken=${authToken}&customerId=${customerId}`
      );
      return data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async transactionHistory(
    authToken,
    accountNumber,
    fromDate,
    toDate,
    institutionCode,
    numberOfItems
  ) {
    try {
      const { data } = await axios.get(
        `${config.transactionHistory}?authtoken=${authToken}&accountNumber=${accountNumber}&fromDate=${fromDate}&toDate=${toDate}&institutionCode=${institutionCode}&numberOfItems=${numberOfItems}`
      );
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAccountDetails(authToken, accountNumber, bankCode) {
    try {
      const { data } = await axios.post(`${config.nameEnquiry}`, {
        AccountNumber: accountNumber,
        BankCode: bankCode,
        Token: authToken,
      });
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getNameEnquiry(authToken, accountNumber, bankCode) {
    try {
      const { data } = await axios.post(`${config.nameEnquiry}`, {
        AccountNumber: accountNumber,
        BankCode: bankCode,
        Token: authToken,
      });
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getbankDetails(authToken, accountNumber) {
    try {
      const { data } = await axios.post(`${config.bankDetails}`, {
        AccountNumber: accountNumber,
        Token: authToken,
      });
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getMultipleNameEnquiry(authToken, payload) {
    const promises = payload.map((item) => {
      return axios.post(`${config.nameEnquiry}`, {
        AccountNumber: item.accountNumber,
        BankCode: item.bankCode,
        Token: authToken,
      });
    });

    const results = await Promise.allSettled(promises);

    const successfulPromises = results.filter(
      (promise) => promise.status === "fulfilled"
    );
    const data = successfulPromises.map((promise) => promise.value.data);

    const failedPromise = results.filter(
      (promise) => promise.status === "rejected"
    );
    const failedPayload = failedPromise.map(
      (promise) => promise.reason.config.data
    );

    console.log(failedPromise, failedPayload);

    return {
      data,
      failedPayload,
    };
  }

  async accountStatement(authToken, accountNumber, fromDate, toDate, isPdf) {
    try {
      const { data } = await axios.get(
        `${config.accountStatement}?authtoken=${authToken}&accountNumber=${accountNumber}&fromDate=${fromDate}&toDate=${toDate}&isPdf=${isPdf}`
      );
      return data;
    } catch (error) {
      // return null;
      console.log(error);
    }
  }

  async getInterbankTransfer(
    Amount,
    Payer,
    ReceiverAccountNumber,
    PayerAccountNumber,
    ReceiverAccountType,
    ReceiverBankCode,
    ReceiverPhoneNumber,
    ReceiverName,
    ReceiverBVN,
    ReceiverKYC,
    Narration,
    TransactionReference,
    NIPSessionID
  ) {
    try {
      const { data } = await axios.post(`${config.interbankTransfer}`, {
        Amount,
        Payer,
        ReceiverAccountNumber,
        PayerAccountNumber,
        ReceiverAccountType,
        ReceiverBankCode,
        ReceiverPhoneNumber,
        ReceiverName,
        ReceiverBVN,
        ReceiverKYC,
        Narration,
        TransactionReference,
        NIPSessionID,
      });
      return data;
    } catch (error) {
      return null;
    }
  }

  async getIntrabankTransfer() {
    try {
      const { data } = await axios.post(`${config.intrabankTransfer}`);
      return data;
    } catch (error) {
      return null;
    }
  }

  async getTransactionsPaginated(
    authToken,
    accountNumber,
    fromDate,
    toDate,
    institutionCode,
    pageNo,
    PageSize
  ) {
    try {
      const { data } = await axios.get(
        `${config.nameEnquiry}?authtoken=${authToken}&accountNumber=${accountNumber}&fromDate=${fromDate}&toDate=${toDate}&institutionCode=${institutionCode}&pageNo=${pageNo}&PageSize=${PageSize}`
      );
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAccountInfo(authtoken, accountNumber, institutionCode) {
    try {
      const { data } = await axios.get(
        `${config.getAccountInfo}?authtoken=${authToken}&accountNumber=${accountNumber}&institutionCode=${institutionCode}`
      );
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async transactionStatus(
    RetrievalReference,
    TransactionDate,
    TransactionType,
    Amount,
    Token
  ) {
    try {
      const { data } = await axios.post(`${config.transactionStatus}`, {
        RetrievalReference,
        TransactionDate,
        TransactionType,
        Amount,
        Token,
      });
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getIntrabankTransfer(
    Amount,
    FromAccountNumber,
    ToAccountNumber,
    RetrievalReference,
    Narration,
    AuthenticationKey
  ) {
    try {
      const { data } = await axios.post(`${config.intrabankTransfer}`, {
        Amount,
        FromAccountNumber,
        ToAccountNumber,
        RetrievalReference,
        Narration,
        AuthenticationKey,
      });
      return data;
    } catch (error) {
      return null;
    }
  }

  async getbankSumaryDetails(authToken, accountNumber) {
    try {
      const { data } = await axios.get(
        `${config.getAccountInfo}?authtoken=${authToken}&accountNumber=${accountNumber}`
      );
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}





module.exports = new BankOneService();
