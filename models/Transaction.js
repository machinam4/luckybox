const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    winnings: {
      type: Number,
      default: 0,
    },
    winAmount: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
    },
    transCode: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "bet",
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
