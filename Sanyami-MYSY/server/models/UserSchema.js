const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  admissionAfter: {
    type: String,
    required: true,
  },
  board: {
    type: String,
    required: true,
  },
  stream: {
    type: String,
    required: true,
  },
  passingYear: {
    type: String,
    required: true,
  },
  admissionYear: {
    type: String,
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("user", UserSchema);
module.exports = User;
