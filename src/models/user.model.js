const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "user name is required"],
    },
    email: {
      type: String,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      required: [true, "Email is required"],
      unique: [true, "Email already exist"],
      immutable: true,
    },
    password: { type: String, required: true, trim: true },
    jobTitle: { type: String, trim: true, default: null },
    organisation: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
  }
);

/*
this is a instance method not a static method
For ex-> UserModel.comparePassword will throw an error because comparePassword is an instance method. Model can access only static methods.
const user = User.findOne();
now user is an instance and this can have access to comparePassword as it is an instance method
*/
userModel.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


//pre and post save hook does not work for update queries
// https://mongoosejs.com/docs/middleware.html#pre
userModel.pre("save", function (next) {
  console.log("save start");
  var user = this;
  console.log(user.isModified("password"), "modified?", user.password);
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userModel.virtual("id").get(function () {
  return this._id;
});

userModel.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", userModel);
module.exports = User;
