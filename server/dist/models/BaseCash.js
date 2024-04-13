"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseCash = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const baseCashSchema = _mongoose.default.Schema({
  value: {
    type: Number,
    required: true
  }
});
const BaseCash = exports.BaseCash = _mongoose.default.model("BaseCash", baseCashSchema);