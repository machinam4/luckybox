// models/otp.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const BoxSchema = new Schema({
    amount: {
      type: Number,
      required: true,
    },
    choice: {
      type: Number,
      required: true,
    },
    status: {
      //play, wait, lose, win
      type: String,
      required: true,
    },
    tax: {
      type: Number,
    },
    boxes:{},
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    player: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
  },
  {
    timestamps: true,
  });

module.exports = mongoose.model('Box', BoxSchema);