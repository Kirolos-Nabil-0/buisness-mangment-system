"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _transactoinsController = require("../controllers/transactoinsController.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();

// Create a new transaction
router.post("/", async (req, res) => {
  try {
    const {
      storeId,
      value,
      quantity,
      type
    } = req.body;
    const newTransaction = await (0, _transactoinsController.createTransaction)(storeId, value, quantity, type);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await (0, _transactoinsController.getAllTransactions)();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Get transaction by ID
router.get("/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await (0, _transactoinsController.getTransactionById)(transactionId);
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Update transaction
router.put("/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const updatedTransactionData = req.body;
    const updatedTransaction = await (0, _transactoinsController.updateTransaction)(transactionId, updatedTransactionData);
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Delete transaction
router.delete("/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    await (0, _transactoinsController.deleteTransaction)(transactionId);
    res.json({
      message: "Transaction deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
var _default = exports.default = router;