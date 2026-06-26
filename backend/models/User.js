const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    isPro: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

//password hashing middleware
//pre means previous. before a user saves the data this function will run.
userSchema.pre("save", async function () {
  //if password not modified skip the function and move next.
  if (!this.isModified("password")) return;
  //genSalt is a thing that generates when a user saves password, it  mingles with the password so that it cant be hacked.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//method to compare password
//userSchema.methods.matchPassword means create a password checking function for all users.
userSchema.methods.matchPassword = async function (enteredPassword) {
  //enteredpassword = password typed during login. this.password means hashed password stored in mongodb.
  console.log("enteredPassword:", enteredPassword);
  console.log("storedPassword:", this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
