import { BaseCash } from "../models/BaseCash.js";

// Utility function to handle errors
const handleError = (error) => {
  throw error;
};

// Utility function to find base cash
const findBaseCash = async () => {
  try {
    // Find the most recent base cash value
    return await BaseCash.findOne().sort({ createdAt: -1 });
  } catch (error) {
    handleError(error);
  }
};

// Create a new base cash value
const createBaseCash = async (value) => {
  try {
    const newBaseCash = await BaseCash.create({ value });
    return newBaseCash;
  } catch (error) {
    handleError(error);
  }
};

// Get the current base cash value
const getBaseCash = async () => {
  try {
    return await findBaseCash();
  } catch (error) {
    handleError(error);
  }
};

// Update the base cash value
// Update the base cash value
const updateBaseCash = async (newValue) => {
  try {
    const baseCash = await findBaseCash();
    if (!baseCash) {
      throw new Error("Base cash value not found");
    }
    // Ensure newValue is a number
    const updatedValue = Number(newValue);
    if (isNaN(updatedValue)) {
      throw new Error("Invalid base cash value");
    }
    baseCash.value = updatedValue;
    return await baseCash.save();
  } catch (error) {
    handleError(error);
  }
};

// Delete the base cash value
const deleteBaseCash = async () => {
  try {
    await BaseCash.deleteMany();
    return { message: "Base cash value deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export { createBaseCash, getBaseCash, updateBaseCash, deleteBaseCash };
