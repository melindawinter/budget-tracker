const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema for database
const transactionSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Enter a name for transaction"
  },
  value: {
    type: Number,
    required: "Enter an amount"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Set up the Transaction model so it can be exported
const Transaction = mongoose.model("Transaction", transactionSchema);

// Export Transaction
module.exports = Transaction;
