const user = require("../model/user.model");
const credentials = {
  apiKey: process.env.SMSAPI_KEY, // use your sandbox app API key for development in the test environment
  username: process.env.SMS_USERNAME, // use 'sandbox' for development in the test environment
};
const Africastalking = require("africastalking")(credentials);

// Initialize a service e.g. SMS
const sms = Africastalking.SMS;


exports.sendSMS = function sendSMS(phoneNumber, text) {
  // Use the service
  const options = {
    to: phoneNumber,
    message: text,
  };

  // Send message and capture the response or error
  sms
    .send(options)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
