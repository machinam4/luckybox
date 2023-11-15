// models/wallet.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    accountNumber: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0.0,
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

module.exports = mongoose.model('Account', accountSchema);
