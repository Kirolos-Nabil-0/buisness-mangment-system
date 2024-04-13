"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateBaseCash = exports.getBaseCash = exports.deleteBaseCash = exports.createBaseCash = void 0;
var _BaseCash = require("../models/BaseCash.js");
// Utility function to handle errors
const handleError = error => {
  throw error;
};

// Utility function to find base cash
const findBaseCash = async () => {
  try {
    // Find the most recent base cash value
    return await _BaseCash.BaseCash.findOne().sort({
      createdAt: -1
    });
  } catch (error) {
    handleError(error);
  }
};

// Create a new base cash value
const createBaseCash = async value => {
  try {
    const newBaseCash = await _BaseCash.BaseCash.create({
      value
    });
    return newBaseCash;
  } catch (error) {
    handleError(error);
  }
};

// Get the current base cash value
exports.createBaseCash = createBaseCash;
const getBaseCash = async () => {
  try {
    return await findBaseCash();
  } catch (error) {
    handleError(error);
  }
};

// Update the base cash value
// Update the base cash value
exports.getBaseCash = getBaseCash;
const updateBaseCash = async newValue => {
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
exports.updateBaseCash = updateBaseCash;
const deleteBaseCash = async () => {
  try {
    await _BaseCash.BaseCash.deleteMany();
    return {
      message: "Base cash value deleted successfully"
    };
  } catch (error) {
    handleError(error);
  }
};
exports.deleteBaseCash = deleteBaseCash;