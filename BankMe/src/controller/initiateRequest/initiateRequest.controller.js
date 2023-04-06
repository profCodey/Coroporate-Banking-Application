const Mandate = require("../../model/mandate.model");
const User = require("../../model/user.model");
const InitiateRequest = require("../../model/initiateRequest.model");
const AuditTrail = require("../../model/auditTrail");
// const { validateInitiateRequestSchema } = require("../../utils/utils");
const { sendEmail } = require("../../utils/emailService");
const { PER_PAGE } = require("../../utils/constants");
const mongoose = require("mongoose");
const Otp = require("../../model/otp.model");
const { userService , auditTrailService, notificationService} = require("../../services");
const { getDateAndTime } = require("../../utils/utils");

const initiateRequest = async (req, res) => {
  try {
    // const { error } = validateInitiateRequestSchema(req.body);
    // if (error)
    //   return res.status(400).json({
    //     message: error.details[0].message,
    //     status: "failed",
    //   });
    const mine = await User.findById(req.user._id);

    const request = new InitiateRequest({
      NIPSessionID: req.body.NIPSessionID,
      amount: req.body.amount,
      beneficiaryAccountName: req.body.beneficiaryAccountName,
      beneficiaryAccountNumber: req.body.beneficiaryAccountNumber,
      beneficiaryAccountType: req.body.beneficiaryAccountType,
      beneficiaryBVN: req.body.beneficiaryBVN,
      beneficiaryBankCode: req.body.beneficiaryBankCode,
      beneficiaryBankName: req.body.beneficiaryBankName,
      beneficiaryKYC: req.body.beneficiaryKYC,
      beneficiaryPhoneNumber: req.body.beneficiaryPhoneNumber,
      customerName: req.body.customerName,
      organizationId: mine.organizationId,
      transactionReference: mongoose.Types.ObjectId().toString().substr(0, 12),
    });

    const mandate = await Mandate.findOne({
      minAmount: { $lte: request.amount },
      maxAmount: { $gte: request.amount },
    }).populate({
      path: "authorisers",
      select: "firstName lastName email phone",
    });

    if (!mandate) {
      return res.status(404).json({
        message: "No mandate found",
        status: "failed",
      });
    }

    request.mandate = mandate._id;
    request.initiator = req.user._id;

    const result = await request.save();
    const notificationsToCreate = [];

    for (const authoriser of mandate.authorisers) {
      const notification = {
        title: "Transaction request Initiated",
        transaction: result._id,
        user: authoriser._id,
        message:
          "A transaction request was initiated and is awaiting your approval",
      };

      notificationsToCreate.push(notification);

      //Mail notification
      const subject = "Transaction Request Initiated";
      const message = `
          <h3>Transaction Request Initiated</h3>
          <p> Dear ${authoriser.firstName}. The below request was initiated for your authorization.</p>
          <p>TransactionID: ${result._id}</p>
          <p>Amount: ${result.amount}</p>
          <p>Kindly login to your account to review</p>
        `;

      await sendEmail(authoriser.email, subject, message);
    }

    // send out notifications
    await notificationService.createNotifications(notificationsToCreate);

    
    // create audit trail
    const user = await userService.getUserById(req.user._id);
    const { date, time } = getDateAndTime();

    await auditTrailService.createAuditTrail({
      user: req.user._id,
      type: "transaction",
      transaction: result._id,
      message: `${user.firstName} ${user.lastName} initiated a transaction request on ${date} by ${time}`,
      organization: mine.organization,
    });

    return res.status(201).json({
      message: "Request initiated successfully and sent for approval",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};

const getAllInitiatorRequests = async (req, res) => {
  const { perPage, page } = req.query;
  console.log(req.user._id);

  const options = {
    page: page || 1,
    limit: perPage || PER_PAGE,
    sort: { createdAt: -1 },
  };

  try {
    const requests = await InitiateRequest.aggregate([
      {
        $match: {
          initiator: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "mandates",
          localField: "mandate",
          foreignField: "_id",
          as: "mandate",
        },
      },
      {
        $unwind: "$mandate",
      },
      {
        $facet: {
          data: [
            {
              $sort: { ...options.sort },
            },
            {
              $skip: options.limit * (options.page - 1),
            },
            {
              $limit: options.limit * 1,
            },
          ],
          meta: [
            {
              $count: "total",
            },
            {
              $addFields: {
                page: options.page,
                perPage: options.limit,
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({
      message: "Request Successful",
      data: {
        requests: requests[0].data,
        meta: requests[0].meta[0],
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllAssignedRequests = async (req, res) => {
  const { perPage, page } = req.query;

  const options = {
    page: page || 1,
    limit: perPage || PER_PAGE,
    sort: { createdAt: -1 },
  };

  try {
    const requests = await InitiateRequest.aggregate([
      {
        $lookup: {
          from: "mandates",
          localField: "mandate",
          foreignField: "_id",
          as: "mandate",
        },
      },
      {
        $unwind: "$mandate",
      },
      {
        $match: {
          $or: [
            {
              "mandate.authorisers": {
                $in: [mongoose.Types.ObjectId(req.user._id)],
              },
            },
            {
              "mandate.verifier": mongoose.Types.ObjectId(req.user._id),
            },
          ],
        },
      },
      {
        $facet: {
          data: [
            {
              $sort: { ...options.sort },
            },
            {
              $skip: options.limit * (options.page - 1),
            },
            {
              $limit: options.limit * 1,
            },
          ],
          meta: [
            {
              $count: "total",
            },
            {
              $addFields: {
                page: options.page,
                perPage: options.limit,
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({
      message: "Request Successful",
      data: {
        requests: requests[0].data,
        meta: requests[0].meta[0],
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllRequestPerOrganization = async (req, res) => {
  const { page, perPage } = req.query;
  const mine = await User.findById(req.user._id)
  const organizationId = mine.organizationId;


  const options = {
    page: page || 1,
    limit: perPage || PER_PAGE,
    sort: { createdAt: -1 },
  };

  try {
    const request = await InitiateRequest.aggregate([
      {
        $match: {
          initiator: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "mandates",
          localField: "mandate",
          foreignField: "_id",
          as: "mandate",
        },
      },
      {
        $unwind: "$mandate",
      },
      {
        $facet: {
          data: [
            {
              $sort: { ...options.sort },
            },
            {
              $skip: options.limit * (options.page - 1),
            },
            {
              $limit: options.limit * 1,
            },
          ],
          meta: [
            {
              $count: "total",
            },
            {
              $addFields: {
                page: options.page,
                perPage: options.limit,
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json({
      message: "Request Successful",
      data: {
        requests: request[0].data,
        meta: request[0].meta[0],
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const _id = req.params.id;
    const request = await InitiateRequest.findOne({ _id })
      .populate({
        path: "mandate",
        select: "maxAmount minAmount authorisers verifier",
        populate: [
          {
            path: "authorisers",
            model: "User",
            select: "firstName lastName",
          },
          {
            path: "verifier",
            model: "User",
            select: "firstName lastName",
          },
        ],
      })
      .populate({
        path: "initiator",
        model: "User",
        select: "firstName lastName email",
      });

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        status: "success",
      });
    }
    res.status(200).json({
      message: "Request Successful",
      data: request,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

const declineRequest = async (req, res) => {
  
      const mine = await User.findById(req.user._id);
  try {
    const _id = req.params.id;
    const userId = req.user._id;

    const request = await InitiateRequest.findById(_id).populate("mandate");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        status: "failed",
      });
    }

    const otpDetails = await Otp.findOne({
      otp: req.body.otp,
      user: userId,
      transaction: request._id,
    });

    if (!otpDetails) {
      return res.status(404).json({
        message: "OTP is incorrect or used",
        status: "failed",
      });
    }

    let duplicate = false;
    for (let i = 0; i < request.authorisersAction.length; i++) {
      let transaction = request.authorisersAction[i];
      if (
        transaction.authoriserID == req.user._id &&
        transaction.status === "rejected"
      ) {
        return res.status(404).json({
          message: "You have already rejected this request",
          status: "failed",
        });
      } else if (
        transaction.authoriserID == req.user._id &&
        transaction.status === "authorised"
      ) {
        transaction.status = "rejected";
        transaction.reason = req.body.reason;
        duplicate = true;
      }
    }

    if (duplicate === false) {
      request.authorisersAction.push({
        status: "rejected",
        authoriserID: userId,
        reason: req.body.reason,
      });
    }

    await notificationService.createNotifications([
      {
        transaction: request._id,
        user: request.initiator,
        title: "Transaction Request Declined",
        message: `An authoriser has declined your transaction request for ${request.customerName}`,
        message: `An authoriser has declined your transaction request for ${request.customerName}`,
      },
      // {
      //   transaction: request._id,
      //   user: request.verifier,
      //   title: "Transaction Request Declined",
      //   message: `An authoriser declined transaction request for ${request.customerName}`,
      // },
    ]);

    request.status = "in progress";

    if (
      request.authorisersAction.length === request.mandate.numberOfAuthorisers
    ) {
      await notificationService.createNotifications([
        {
          transaction: request._id,
          user: request.mandate.verifier,
          title: "Verification Required",
          message: "New transaction request require your review",
        },
      ]);

      request.status = "awaiting verification";
    }

    // create audit trail
    const user = await User.findById(req.user._id);
    let dt = new Date(new Date().toISOString());
    let date = dt.toString().slice(0, 15);
    let time = dt.toString().slice(16, 21);

    let audit = await AuditTrail.create({
      user: req.user._id,
      type: "transaction",
      transaction: request._id,
      message: `${user.firstName} rejected a transaction request on ${date} by ${time}`,
      organization: mine.organization,
    });

    await audit.save();
    await Otp.findByIdAndDelete(otpDetails._id);
    await request.save();

    return res.status(200).json({
      message: "Request declined successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};

const approveRequest = async (req, res) => {
      const mine = await User.findById(req.user._id);
  try {
    const _id = req.params.id;
    const userId = req.user._id;

    const request = await InitiateRequest.findById(_id).populate("mandate");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        status: "failed",
      });
    }
    
    const otpDetails = await Otp.findOne({
      otp: req.body.otp,
      user: userId,
      transaction: request._id,
    });

    if (!otpDetails) {
      return res.status(404).json({
        message: "OTP is incorrect or used",
        status: "failed",
      });
    }

    let duplicate = false;
    for (let i = 0; i < request.authorisersAction.length; i++) {
      let transaction = request.authorisersAction[i];
      if (
        transaction.authoriserID == req.user._id &&
        transaction.status === "authorised"
      ) {
        return res.status(404).json({
          message: "You have already approved this transaction",
          status: "failed",
        });
      } else if (
        transaction.authoriserID == req.user._id &&
        transaction.status === "rejected"
      ) {
        transaction.reason = req.body.reason;
        transaction.status = "authorised";
        duplicate = true;
      }
    }

    if (duplicate === false) {
      request.authorisersAction.push({
        status: "authorised",
        authoriserID: userId,
      });
    }

    await notificationService.createNotifications([
      {
        transaction: request._id,
        user: request.initiator,
        title: "Transaction Request Approved",
        message: `An authoriser has approved your transaction request for ${request.customerName}`,
      },
    ]);

    request.status = "in progress";

    if (
      request.authorisersAction.length == request.mandate.numberOfAuthorisers
    ) {
      await notificationService.createNotifications([
        {
          transaction: request._id,
          user: request.verifier,
          title: "Verification Required",
          message: "New transaction request require your review",
        },
      ]);
      request.status = "awaiting verification";
    }

    // create audit trail
    const user = await User.findById(req.user._id);
    let dt = new Date(new Date().toISOString());
    let date = dt.toString().slice(0, 15);
    let time = dt.toString().slice(16, 21);

    let audit = await AuditTrail.create({
      user: req.user._id,
      type: "transaction",
      transaction: request._id,
      message: `${user.firstName} authorised a transaction request on ${date} by ${time}`,
      organization: mine.organization,
    });

    await audit.save();
    await request.save();
    await Otp.findByIdAndDelete(otpDetails._id);

    return res.status(200).json({
      message: "Request approved successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};

const verifierApproveRequest = async (req, res) => {
      const mine = await User.findById(req.user._id);
  try {
    const _id = req.params.id;
    const userId = req.user._id;

    const request = await InitiateRequest.findById(_id).populate("mandate");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        status: "failed",
      });
    }

    const otpDetails = await Otp.findOne({
      otp: req.body.otp,
      user: userId,
      transaction: request._id,
    });

    if (!otpDetails) {
      return res.status(404).json({
        message: "OTP is incorrect or used",
        status: "failed",
      });
    }

    // update request
    request.status = "approved";
    const verifierAction = {
      status: "approved",
      reason: req.body.reason,
    };
    request.verifierAction = verifierAction;
    await request.save();

    const authorizers = request.mandate.authorisers;




    

    // notify initiator and authorizers
    await notificationService.createNotifications([
      {
        transaction: request._id,
        user: request.initiator,
        title: "Request approved",
        message: `Your transaction request for ${request.customerName} has been approved`,
      },
      ...authorizers.map((authorizer) => ({
        transaction: request._id,
        user: authorizer,
        title: "Request approved",
        message: `Transaction request for ${request.customerName} has been approved`,
      })),
    ]);

    // create audit trail
    const user = await User.findById(req.user._id);
    let dt = new Date(new Date().toISOString());
    let date = dt.toString().slice(0, 15);
    let time = dt.toString().slice(16, 21);

    let audit = await AuditTrail.create({
      user: req.user._id,
      type: "transaction",
      transaction: request._id,
      message: `${user.firstName} approved a transaction request on ${date} by ${time}`,
      organization: mine.organization,
    });

    await audit.save();

    // delete otp from database
    await Otp.findByIdAndDelete(otpDetails._id);

    return res.status(200).json({
      message: "Request verified successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};

const verifierDeclineRequest = async (req, res) => {
  try {
    const _id = req.params.id;
    const userId = req.user._id;

    const request = await InitiateRequest.findById(_id).populate("mandate");

    // find request
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        status: "failed",
      });
    }

    // find and validate otp
    const otpDetails = await Otp.findOne({
      otp: req.body.otp,
      user: userId,
      transaction: request._id,
    });
    if (!otpDetails) {
      return res.status(404).json({
        message: "OTP is incorrect or used",
        status: "failed",
      });
    }

    // update request
    request.status = "declined";
    const verifierAction = {
      status: "declined",
      reason: req.body.reason,
    };
    request.verifierAction = verifierAction;
    await request.save();

    // create notifications
    const authorizers = request.mandate.authorisers;
    await notificationService.createNotifications([
      {
        transaction: request._id,
        user: request.initiator,
        title: "Request not Verified",
        message: `Your transaction request for ${request.customerName} has been declined`,
      },
      ...authorizers.map((authorizer) => ({
        transaction: request._id,
        user: authorizer,
        title: "Request not Verified",
        message: `Transaction request for ${request.customerName} has been declined`,
      })),
    ]);

    // delete otp from the database completely
    await Otp.findByIdAndDelete(otpDetails._id);

    return res.status(200).json({
      message: "Request declined successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};

module.exports = {
  initiateRequest,
  declineRequest,
  approveRequest,
  getAllInitiatorRequests,
  getAllRequestPerOrganization,
  getRequestById,
  getAllAssignedRequests,
  verifierDeclineRequest,
  verifierApproveRequest,
};
