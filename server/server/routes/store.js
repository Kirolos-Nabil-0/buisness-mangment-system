import express from "express";
import {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
} from "../controllers/storeController.js";

const router = express.Router();

// Create a new store
router.post("/", async (req, res) => {
  try {
    const { name, numberOfItemsAvailable } = req.body;
    const newStore = await createStore(name, numberOfItemsAvailable);
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all stores
router.get("/", async (req, res) => {
  try {
    const stores = await getAllStores();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get store by ID
router.get("/:storeId", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const store = await getStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update store
router.put("/:storeId", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const updatedStoreData = req.body;
    const updatedStore = await updateStore(storeId, updatedStoreData);
    res.json(updatedStore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete store
router.delete("/:storeId", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    await deleteStore(storeId);
    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
