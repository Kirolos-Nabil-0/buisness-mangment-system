"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transaction = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const transactionSchema = _mongoose.default.Schema({
  store: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Store",
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["sale", "purchase", "other"],
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
});
const Transaction = exports.Transaction = _mongoose.default.model("Transaction", transactionSchema);