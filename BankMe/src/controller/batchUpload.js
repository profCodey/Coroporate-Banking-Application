const multer = require("multer");
let csvToJson = require("convert-csv-to-json");
const fs = require("fs");
const excelToJson = require("convert-excel-to-json");
const Mandate = require("../model/mandate.model");
const User = require("../model/user.model");
const InitiateRequest = require("../model/initiateRequest.model");
const { validateInitiateRequestSchema } = require("../utils/utils");
const { sendEmail } = require("../utils/emailService");
const notificationService = require("../services/notification.service");
const AuditTrail = require("../model/auditTrail");

const batchUpload = async (req, res) => {
  try {
    let data;
    const excelDocs = ["xlsx", "xls"];
    const csvDocs = ["csv"];

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Please upload a file",
        status: "failed",
      });
    }

    let fileExtension = req.file.originalname.split(".")[1];
    let formattedFile;

    if (excelDocs.includes(fileExtension)) {
      data = excelToJson({
        sourceFile: req.file.path,
        header: {
          rows: 1,
        },
        columnToKey: {
          "*": "{{columnHeader}}",
        },
      });

      let result;
      for (let i in data) {
        result = i;
        break;
      }
      formattedFile = data[result];
    } else if (csvDocs.includes(fileExtension)) {
      data = csvToJson.fieldDelimiter(",").getJsonFromCsv(req.file.path);
      formattedFile = data;
    } else {
      return res.status(400).json({
        message: "Invalid file type. Please upload a csv or excel file",
        status: "failed",
      });
    }

    fs.unlinkSync(req.file.path);

    let mandate = await Mandate.find({})
      .populate({
        path: "authorisers",
        select: "firstName email",
      })
      .populate("verifier");

    for (let i = 0; i < formattedFile.length; i++) {
      const datum = formattedFile[i];
      let request = new InitiateRequest({
        customerName: datum.customerName,
        amount: datum.amount,
        bankName: datum.bankName,
        accountNumber: datum.accountNumber,
        accountName: datum.accountName,
        initiator: req.user._id,
        status: "pending",
      });

      let verifier;
      var authoriserDetails;
      let mandateID;

      for (let i = 0; i < mandate.length; i++) {
        let item = mandate[i];
        if (
          request.amount >= mandate.minAmount &&
          request.amount <= mandate.maxAmount
        ) {
          authoriserDetails = item.authorisers;
          verifier = item.verifier._id;
          mandateID = item._id;
        }
      }

      request.initiator = req.user._id;
      request.mandate = mandateID;
      request.verifier = verifier;
      request.status = "pending";

      let result = await request.save();

      for (let i = 0; i < (authoriserDetails?.length ?? []); i++) {
        let authoriser = authoriserDetails[i];

        const subject = "Transaction Request Initiated";
        const message = `
          <h3>Transaction Request Initiated</h3>
          <p> Dear ${authoriser.firstName}. The below request was initiated for your authorization.</p>
          <p>TransactionID: ${result._id}</p>
          <p>Amount: ${result.amount}</p>
          <p>Kindly login to your account to review</p>
        `;

        await sendEmail(authoriser.email, subject, message);

        await notificationService.createNotifications([
          {
            title: "Transaction request Initiated",
            transaction: result._id,
            user: authoriser._id,
            message:
              "A transaction request was initiated and is awaiting your approval",
          },
        ]);
      }

      // create audit trail
      const user = await User.findById(req.user._id);
      let dt = new Date(new Date().toISOString());
      let date = dt.toString().slice(0, 15);
      let time = dt.toString().slice(16, 21);

      let audit = await AuditTrail.create({
        user: req.user._id,
        type: "transaction",
        transaction: result._id,
        message: `${user.firstName} ${user.lastName} initiated a transaction request on ${date} by ${time}`,
        organization: user.organization,
      });

      await audit.save();
    }

    return res
      .status(200)
      .json({ message: "File uploaded successfully", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = batchUpload;
