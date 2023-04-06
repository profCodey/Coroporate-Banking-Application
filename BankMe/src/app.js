const express = require("express");
const bodyparser = require("body-parser");
require("dotenv").config();
const app = express();
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");


const userRoute = require("./routes/user.route");
const adminRequest = require("./routes/adminRequest");
const tokenRoute = require("./routes/csrfToken");
const accountRoute = require("./routes/account");
const mandateRoute = require("./routes/mandate.route");
const requestRoute = require("./routes/initiateRequest");
const paystackRoute = require("./routes/paystack.route");
const trailRoute = require("./routes/auditTrail");
const authRoute = require("./routes/auth.route");
const notificationRoute = require("./routes/notification.route");
const otpRoute = require("./routes/otp.route");
const privilegeRoute = require("./routes/privilege.route");
const bankoneRoute = require("./routes/bankone.route");


const cors = require("cors");
const connectDB = require("./config/db");


let URI = process.env.MONGO_URI;

if (process.env.NODE_ENV == "development") {
  URI = "mongodb://localhost/xanotech";
}

connectDB(URI, () => {
  app.listen(process.env.PORT, () => {
    console.log(
      "listening for requests on port",
      process.env.PORT,
      process.env.NODE_ENV
    );
  });
});

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


app.use("/api/token", tokenRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/account", accountRoute);
app.use("/api/mandate", mandateRoute);
app.use("/api", paystackRoute);
app.use("/api/audit_trails", trailRoute);
app.use("/api/requests", requestRoute);
app.use("/api/notifications", notificationRoute); 
app.use("/api/otp", otpRoute);
app.use("/api/privileges", privilegeRoute); 
app.use("/api/ticket", adminRequest);
app.use("/api/bank", bankoneRoute);



app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.use((req, res, next) => {
  if (res.headersSent) {
    return next();
  }
  res
    .status(404)
    .json({
      message:
        "404 error! The endpoint is not available on the server. Kindly cross check the url",
    });
});

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Listeing on port ${port}...`);
// });

module.exports = app;
