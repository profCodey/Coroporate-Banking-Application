const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Privilege = require("./privilege.model");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phone: String,
    gender: String,
    organizationId: String,
    imageUrl: String,
    privileges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Privilege",
      },
    ],
    role: {
      type: String,
      required: true,
      enum: ["super-admin", "admin", "user"],
    },
    token: String,
    secrets: {
      type: [mongoose.Schema.Types.Mixed],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.secrets;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.methods.generateAuthToken = async function () {
  const privileges =
    (await Privilege.find({ _id: { $in: this.privileges } })) || [];

  const token = jwt.sign(
    {
      _id: this._id,
      organizationId: this.organizationId,
      privileges: privileges.map((privilege) => privilege.name),
      firstName: this.firstName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
