"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _storeController = require("../controllers/storeController.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();

// Create a new store
router.post("/", async (req, res) => {
  try {
    const {
      name,
      numberOfItemsAvailable
    } = req.body;
    const newStore = await (0, _storeController.createStore)(name, numberOfItemsAvailable);
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Get all stores
router.get("/", async (req, res) => {
  try {
    const stores = await (0, _storeController.getAllStores)();
    res.json(stores);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Get store by ID
router.get("/:storeId", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const store = await (0, _storeController.getStoreById)(storeId);
    if (!store) {
      return res.status(404).json({
        message: "Store not found"
      });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Update store
router.put("/:storeId", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const updatedStoreData = req.body;
    const updatedStore = await (0, _storeController.updateStore)(storeId, updatedStoreData);
    res.json(updatedStore);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Delete store
router.delete("/:storeId", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    await (0, _storeController.deleteStore)(storeId);
    res.json({
      message: "Store deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
var _default = exports.default = router;