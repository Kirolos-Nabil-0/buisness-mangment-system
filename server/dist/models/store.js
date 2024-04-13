"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const storeSchema = _mongoose.default.Schema({
  name: {
    type: String,
    required: true
  },
  numberOfItemsAvailable: {
    type: Number,
    required: true
  }
});
const Store = exports.Store = _mongoose.default.model("Store", storeSchema);