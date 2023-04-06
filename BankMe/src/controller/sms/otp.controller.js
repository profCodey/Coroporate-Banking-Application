const { sendSMS } = require("../../services/sms.service");
const crypto = require("crypto");
const User = require("../../model/user.model");
const { sendEmail } = require("../../utils/emailService");
const Otp = require("../../model/otp.model");

const generateOTP = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id)
    const { context, transaction } = req.body;

    const otp = crypto.randomBytes(3).toString("hex");
    const smsBody = `Your GCMB confirmation OTP code is ${otp}.`;

    let num = `${user.phone}`;
    if (num.startsWith("0")) {
      num = num.replace("0", "+234");
    }

    let newOtp = {}

    const otpRecord = await Otp.findOne({
      user: user._id,
      transaction,
      context,
    });

    if (!otpRecord) {
      // create one and send to the user
      newOtp = new Otp({
        user: user._id,
        transaction,
        context,
        otp,
      });
    } else {
      newOtp = otpRecord;
      newOtp.otp = otp;
    }

    await newOtp.save();

    // await sendSMS(num, smsBody);

    const subject = "Verification Code";
    const message = `${user.firstName}, Your GCMB confirmation OTP code is ${otp}.`;

    await sendEmail(user.email, subject, message);

    return res.status(200).json({
      message: "Successfully sent otp code",
      data: otp,
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      data: null,
      status: "failed",
    });
  }
};



module.exports = {
  generateOTP
};
