"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _cashController = require("../controllers/cashController.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();

// Create base cash
router.post("/", async (req, res) => {
  try {
    const {
      value
    } = req.body;
    const newBaseCash = await (0, _cashController.createBaseCash)(value);
    res.status(201).json(newBaseCash);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Get base cash
router.get("/", async (req, res) => {
  try {
    const baseCash = await (0, _cashController.getBaseCash)();
    res.json(baseCash);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Update base cash
router.put("/", async (req, res) => {
  try {
    const {
      value
    } = req.body;
    const updatedBaseCash = await (0, _cashController.updateBaseCash)(value);
    res.json(updatedBaseCash);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Delete base cash
router.delete("/", async (req, res) => {
  try {
    const deletionResult = await (0, _cashController.deleteBaseCash)();
    res.json(deletionResult);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
var _default = exports.default = router;