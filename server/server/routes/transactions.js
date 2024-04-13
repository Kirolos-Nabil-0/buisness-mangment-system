import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactoinsController.js";

const router = express.Router();

// Create a new transaction
router.post("/", async (req, res) => {
  try {
    const { storeId, value, quantity, type } = req.body;
    const newTransaction = await createTransaction(
      storeId,
      value,
      quantity,
      type
    );
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by ID
router.get("/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await getTransactionById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update transaction
router.put("/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const updatedTransactionData = req.body;
    const updatedTransaction = await updateTransaction(
      transactionId,
      updatedTransactionData
    );
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction
router.delete("/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    await deleteTransaction(transactionId);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
