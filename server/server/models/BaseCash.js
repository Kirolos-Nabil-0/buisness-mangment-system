import mongoose from "mongoose";

const baseCashSchema = mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
});

export const BaseCash = mongoose.model("BaseCash", baseCashSchema);
