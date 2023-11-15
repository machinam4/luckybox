// models/otp.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
},{
    timestamps: true
}
);

module.exports = mongoose.model('OTP', otpSchema);
