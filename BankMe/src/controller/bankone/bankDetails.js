const bankOneService = require("../../services/bankOne.service");
const authToken = process.env.AUTHTOKEN;
const { sendEmail } = require("../../utils/emailService");

const getAccountByAccountNo = async (req, res) => {
  let accountNo = req.params.account || "00680011010004232";
  const accountDetails = await bankOneService.accountByAccountNo(
    accountNo,
    authToken
  );

  if (!accountDetails) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Account Details retrieved successfully",
    data: accountDetails,
  });
};

const getAccountByCustomerID = async (req, res) => {
  let customerId = req.params.customerId || "004232";

  const accountDetails = await bankOneService.accountByCustomerID(
    customerId,
    authToken
  );

  if (!accountDetails) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Account Details retrieved successfully",
    data: accountDetails,
  });
};

const getTransactionHistory = async (req, res) => {
  const accountNumber = req.query.accountNumber;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const institutionCode = req.query.institutionCode;
  const numberOfItems = req.query.numberOfItems;
  const authtoken = "4c398863-d777-4afa-bd89-dd01859740d1";
  const transHistory = await bankOneService.transactionHistory(
    authtoken,
    accountNumber,
    fromDate,
    toDate,
    institutionCode,
    numberOfItems
  );
  console.log("transactionHistory", transHistory)
  
  if (!transHistory) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Account Details retrieved successfully",
    data: transHistory,
  });
};

const getAccountStatement = async (req, res) => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const isPdf = req.query.isPdf;
  const account = req.params.account;

  console.log(account);

  const statement = await bankOneService.accountStatement(
    authToken,
    account,
    fromDate,
    toDate,
    isPdf
  );

  if (!statement) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }
};

const getAccountDetails = async (req, res) => {
  const { accountNumber } = req.params;

  const accountDetails = await bankOneService.getbankDetails(
    authToken,
    accountNumber
  );

  if (!accountDetails) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Name account details retrieved successfully",
    data: accountDetails,
  });
};



const getNameEnquiry = async (req, res) => {
  const { accountNumber, bankCode } = req.body;

  const enquiry = await bankOneService.getNameEnquiry(
    authToken,
    accountNumber,
    bankCode
  );

  if (!enquiry) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Name Enquiry retrieved successfully",
    data: enquiry,
  });
};

const getTransactionsPaginated = async (req, res) => {
  const accountNumber = req.params.account;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const institutionCode = req.query.institutionCode;
  const pageNo = req.query.pageNo;
  const PageSize = req.query.PageSize;

  const getTransactions = await bankOneService.getTransactionsPaginated(
    authToken,
    accountNumber,
    fromDate,
    toDate,
    institutionCode,
    pageNo,
    PageSize
  );

  if (!getTransactions) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Account Details retrieved successfully",
    data: getTransactions,
  });
};

const interbankTransfer = async (req, res) => {
  const {
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
  } = req.body;

  const interTransfer = await bankOneService.getInterbankTransfer(
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
  );

  if (!interTransfer) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Account Details retrieved successfully",
    data: interTransfer,
  });
};


const getAccountInfo = async (req, res) => {
  let accountNumber = req.query.accountNumber;
console.log("working here")
  const accountInfo = await bankOneService.getbankSumaryDetails(
    authToken,
    accountNumber
  );
  if (!accountInfo) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Account Details retrieved successfully",
    data: accountInfo,
  });
};



const getTransactionStatus = async (req, res) => {
  let  RetrievalReference = req.body.RetrievalReference;
   let TransactionDate = req.body.TransactionDate;
    let institutionCode = req.body.institutionCode;
    let Amount = req.body.Amount;

  const transactionStatusInfo = await bankOneService.transactionStatus(
    RetrievalReference,
    TransactionDate,
    TransactionType,
    Amount,
    authToken,
  )
  if (!transactionStatusInfo) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Account Details retrieved successfully",
    data: transactionStatusInfo,
  });
};


const intrabankTransfer = async (req, res) => {
  const {
     Amount,
    FromAccountNumber,
    ToAccountNumber,
    RetrievalReference,
    Narration,
  } = req.body;

  let AuthenticationKey = authToken;

  const intraTransferDetails = await bankOneService.getIntrabankTransfer(
    Amount,
    FromAccountNumber,
    ToAccountNumber,
    RetrievalReference,
    Narration,
    AuthenticationKey,
  );

  if (!intraTransferDetails ) {
    return res.status(500).json({
      status: "Failed",
      message: "Unable to get bank account details",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Account Details retrieved successfully",
    data: intraTransferDetails,
  });
};




module.exports = {
  getAccountByAccountNo,
  getAccountByCustomerID,
  getTransactionHistory,
  getAccountStatement,
  getNameEnquiry,
  getTransactionsPaginated,
  interbankTransfer,
  getAccountDetails,
  getAccountInfo,
  getTransactionStatus,
  intrabankTransfer
};





