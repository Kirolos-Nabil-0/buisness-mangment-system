import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["sale", "purchase", "other"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
