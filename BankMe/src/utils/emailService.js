var nodemailer = require('nodemailer');
const user = require('../model/user.model');
const jwt = require("jsonwebtoken");

function email(email, title, message) {

  	const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
 console.log(process.env.PORT)



  var mailOptions = {
    from: '"GCMFB" <otunaiyademilade@gmail.com.com>',
    to: email,
    subject: title,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent successfully to ', info.envelope.to[0]);
  });
}

exports.sendEmail = email;