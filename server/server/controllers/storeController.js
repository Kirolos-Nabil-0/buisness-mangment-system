import { Store } from "../models/store.js";

// Utility function to handle errors
const handleError = (error) => {
  throw error;
};

// Create a new store
const createStore = async (name, numberOfItemsAvailable) => {
  try {
    const newStore = new Store({
      name,
      numberOfItemsAvailable,
    });
    return await newStore.save();
  } catch (error) {
    handleError(error);
  }
};

// Get all stores
const getAllStores = async () => {
  try {
    return await Store.find();
  } catch (error) {
    handleError(error);
  }
};

// Get store by ID
const getStoreById = async (storeId) => {
  try {
    return await Store.findById(storeId);
  } catch (error) {
    handleError(error);
  }
};

// Update store
const updateStore = async (storeId, updatedStoreData) => {
  try {
    return await Store.findByIdAndUpdate(storeId, updatedStoreData, {
      new: true,
    });
  } catch (error) {
    handleError(error);
  }
};

// Delete store
const deleteStore = async (storeId) => {
  try {
    return await Store.findByIdAndDelete(storeId);
  } catch (error) {
    handleError(error);
  }
};

export { createStore, getAllStores, getStoreById, updateStore, deleteStore };
