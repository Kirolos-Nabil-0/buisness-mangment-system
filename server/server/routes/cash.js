import express from "express";
import {
  createBaseCash,
  getBaseCash,
  updateBaseCash,
  deleteBaseCash,
} from "../controllers/cashController.js";

const router = express.Router();

// Create base cash
router.post("/", async (req, res) => {
  try {
    const { value } = req.body;
    const newBaseCash = await createBaseCash(value);
    res.status(201).json(newBaseCash);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get base cash
router.get("/", async (req, res) => {
  try {
    const baseCash = await getBaseCash();
    res.json(baseCash);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update base cash
router.put("/", async (req, res) => {
  try {
    const { value } = req.body;
    const updatedBaseCash = await updateBaseCash(value);
    res.json(updatedBaseCash);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete base cash
router.delete("/", async (req, res) => {
  try {
    const deletionResult = await deleteBaseCash();
    res.json(deletionResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
