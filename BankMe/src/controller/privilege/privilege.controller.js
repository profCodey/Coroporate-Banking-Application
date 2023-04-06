const Privilege = require("../../model/privilege.model");
const { sendEmail } = require("../../utils/emailService");
const User = require("../../model/user.model");

const getAllPrivileges = async (req, res) => {
  try {
    const privileges = await Privilege.find();
    res.status(200).json({
      message: "Successfully fetched privileges",
      data: { privileges },
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

const roleSwitchMailNotification = async (req, res) => {
  try {
    const email = req.body.email;
    const currentRole = req.body.currentRole;
    const currentPrivilege = req.body.currentPrivilege;
    const newRole = req.body.newRole;
    const newPrivilege = req.body.newPrivilege;

    const privilege = Privilege.find({ name: newPrivilege });
    if (!privilege) {
      return res.status(404).json({
        message: "The user Privilege you inputed doesnt exist",
        status: "failed",
      });
    }

    const user = await User.find({ email: email, role: currentRole });

    const sender = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User doesnt exist or user role specified doesnt match",
        status: "failed",
      });
    }

    //Email Details
    const token = jwt.sign(
      {
        user_email: user.email,
        currentRole: req.body.currentRole,
        currentPrivilege: req.body.currentPrivilege,
        newRole: req.body.newRole,
        newPrivilege: req.body.newPrivilege,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: "30m",
      }
    );

    user.token = token;

    const link = `${process.env.FRONTEND_URL}/switch-role/${token}`;
    //Mail notification
    const subject = "Request to Switch Roles";
    const message = `
          <h3>Request to Switch Roles</h3>
          <p> Dear ${user.firstName}. A request was sent by ${sender.firstName} to switch your role from ${currentRole} to ${newRole}.</p>
          <p>Kindly click the link below to confirm the request</p>
          <p>Amount: ${result.amount}</p>
        `;

    await sendEmail(user.email, subject, message);

    res.status(200).json({
      message: "Successfully notified user of role switch",
      data: token,
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

const updateUserRole = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    const mail = decoded;

    if (!mail) {
      res.status(400).json({
        status: "failed",
        Message: "Invalid token",
        data: null,
      });
    }

    const user = await User.findOne({ email: mail.user_email });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        Message: "User not found",
        data: null,
      });
    }

    const privilege = Privilege.find({ name: mail.newPrivilege });

    user.role = mail.newRole;
    user.privileges = privilege

    let mine = await User.findById(req.user._id);
    if (mine.role === "admin" && user.role !== "user") {
       return res.status(401).json({
         status: "failed",
         Message: "Admin is not authorised to switch promote user to an higher role",
         data: null,
       });
    }

    const switchRole = await user.save();

    return res.status(200).json({
      message: "Successfully switched user role and privilege",
      data: { switchRole },
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
  getAllPrivileges,
  roleSwitchMailNotification,
  updateUserRole,
};
