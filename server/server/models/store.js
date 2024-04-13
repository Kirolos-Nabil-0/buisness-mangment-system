import mongoose from "mongoose";

const storeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numberOfItemsAvailable: {
    type: Number,
    required: true,
  },
});

export const Store = mongoose.model("Store", storeSchema);
