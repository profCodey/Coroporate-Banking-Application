const Csrf = require("../../model/token");


const generateCSRFToken = async (req, res) => {

  const token = await Csrf.create({
    token: req.csrfToken(),
  });

  await token.save();

  return res.json({
    status: "Success",
    message: "CSRF Token generated successfully",
    csrfToken: req.csrfToken(),
  });
};

// const generateCSRFToken = async () => {
//   return
// }

module.exports = generateCSRFToken;
