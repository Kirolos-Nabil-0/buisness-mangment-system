"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStore = exports.getStoreById = exports.getAllStores = exports.deleteStore = exports.createStore = void 0;
var _store = require("../models/store.js");
// Utility function to handle errors
const handleError = error => {
  throw error;
};

// Create a new store
const createStore = async (name, numberOfItemsAvailable) => {
  try {
    const newStore = new _store.Store({
      name,
      numberOfItemsAvailable
    });
    return await newStore.save();
  } catch (error) {
    handleError(error);
  }
};

// Get all stores
exports.createStore = createStore;
const getAllStores = async () => {
  try {
    return await _store.Store.find();
  } catch (error) {
    handleError(error);
  }
};

// Get store by ID
exports.getAllStores = getAllStores;
const getStoreById = async storeId => {
  try {
    return await _store.Store.findById(storeId);
  } catch (error) {
    handleError(error);
  }
};

// Update store
exports.getStoreById = getStoreById;
const updateStore = async (storeId, updatedStoreData) => {
  try {
    return await _store.Store.findByIdAndUpdate(storeId, updatedStoreData, {
      new: true
    });
  } catch (error) {
    handleError(error);
  }
};

// Delete store
exports.updateStore = updateStore;
const deleteStore = async storeId => {
  try {
    return await _store.Store.findByIdAndDelete(storeId);
  } catch (error) {
    handleError(error);
  }
};
exports.deleteStore = deleteStore;