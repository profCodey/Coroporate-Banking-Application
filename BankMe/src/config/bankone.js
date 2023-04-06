// register api endpoints here

const bankone = {
  getAccountByAccountNo:
    "http://52.168.85.231/BankOneWebAPI/api/Account/GetAccountByAccountNumber/2/",
  getAccountByCustomerID:
    "http://52.168.85.231/BankOneWebAPI/api/Account/GetAccountsByCustomerId/2/",
  transactionHistory:
    "http://52.168.85.231/BankOneWebAPI/api/Account/GetTransactions/2",
  accountStatement:
    "http://52.168.85.231/BankOneWebAPI/api/Account/GenerateAccountStatement2/2",
  interbankTransfer:
    "http://52.168.85.231/thirdpartyapiservice/apiservice/Transfer/InterbankTransfer",
  intrabankTransfer:
    "http://52.168.85.231/thirdpartyapiservice/apiservice/CoreTransactions/LocalFundsTransfer",
  nameEnquiry:
    "http://52.168.85.231/thirdpartyapiservice/apiservice/Transfer/NameEnquiry",
  getTransactions:
    "http://52.168.85.231/BankOneWebAPI/api/Account/GetTransactionsPaginated/2",
  getAccountInfo: "http://52.168.85.231/BankOneWebAPI/api/Account/GetAccountSummary/2",
  transactionStatus: "http://52.168.85.231/thirdpartyapiservice/apiservice/CoreTransactions/TransactionStatusQuery"
};

module.exports = bankone;
