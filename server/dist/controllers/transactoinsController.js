"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTransaction = exports.getTransactionById = exports.getAllTransactions = exports.deleteTransaction = exports.createTransaction = void 0;
var _transactions = require("../models/transactions.js");
var _BaseCash = require("../models/BaseCash.js");
var _store = require("../models/store.js");
// Utility function to handle errors
const handleError = error => {
  throw error;
};

// Create a new transaction
const createTransaction = async (storeId, value, quantity, type) => {
  try {
    // Find the store by ID
    const store = await _store.Store.findById(storeId);
    if (!store) {
      throw new Error("Store not found");
    }

    // Update store's number of items based on transaction type
    if (type === "sale") {
      if (store.numberOfItemsAvailable < quantity) {
        throw new Error("Insufficient items in store for sale");
      }
      store.numberOfItemsAvailable -= Number(quantity); // Decrease item count for sales
    } else if (type === "purchase") {
      store.numberOfItemsAvailable += Number(quantity); // Increase item count for purchases
    }

    // Save the updated store
    await store.save();

    // Create the transaction
    const newTransaction = new _transactions.Transaction({
      store: storeId,
      value,
      quantity,
      type
    });
    const savedTransaction = await newTransaction.save();

    // Update base cash based on the transaction type
    const isIncrease = type === "purchase"; // Increase for purchase, decrease for sale
    await updateBaseCash(value, isIncrease);
    return savedTransaction;
  } catch (error) {
    handleError(error);
  }
};

// Get all transactions
exports.createTransaction = createTransaction;
const getAllTransactions = async () => {
  try {
    return await _transactions.Transaction.find();
  } catch (error) {
    handleError(error);
  }
};

// Get transaction by ID
exports.getAllTransactions = getAllTransactions;
const getTransactionById = async transactionId => {
  try {
    return await _transactions.Transaction.findById(transactionId);
  } catch (error) {
    handleError(error);
  }
};
exports.getTransactionById = getTransactionById;
const updateTransaction = async (transactionId, updatedTransactionData) => {
  try {
    const oldTransaction = await _transactions.Transaction.findById(transactionId);
    if (!oldTransaction) {
      throw new Error("Transaction not found");
    }

    // Reverse effects of old transaction
    await adjustStoreInventory(oldTransaction.store, oldTransaction.quantity, oldTransaction.type, true);
    await updateBaseCash(oldTransaction.value, oldTransaction.type !== "purchase");

    // Apply effects of new transaction
    await adjustStoreInventory(updatedTransactionData.store, updatedTransactionData.quantity, updatedTransactionData.type);
    await updateBaseCash(updatedTransactionData.value, updatedTransactionData.type === "purchase");

    // Update the transaction in the database
    const updatedTransaction = await _transactions.Transaction.findByIdAndUpdate(transactionId, updatedTransactionData, {
      new: true
    });
    return updatedTransaction;
  } catch (error) {
    handleError(error);
  }
};

// Delete transaction
exports.updateTransaction = updateTransaction;
const deleteTransaction = async transactionId => {
  try {
    const transaction = await _transactions.Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Reverse the effects of the transaction on store inventory and base cash
    await adjustStoreInventory(transaction.store, transaction.quantity, transaction.type, true);
    await updateBaseCash(transaction.value, transaction.type !== "purchase");

    // Delete the transaction
    await _transactions.Transaction.findByIdAndDelete(transactionId);
  } catch (error) {
    handleError(error);
  }
};

// Adjust store inventory
exports.deleteTransaction = deleteTransaction;
const adjustStoreInventory = async (storeId, quantity, type, isReversal = false) => {
  const store = await _store.Store.findById(storeId);
  console.log(store);
  if (!store) {
    throw new Error("Store not found");
  }
  let adjustedQuantity = Number(quantity);
  if (isReversal) {
    adjustedQuantity = type === "sale" ? adjustedQuantity : -adjustedQuantity;
    console.log(adjustedQuantity);
  } else {
    adjustedQuantity = type === "purchase" ? adjustedQuantity : -adjustedQuantity;
    console.log(adjustedQuantity);
  }
  store.numberOfItemsAvailable += adjustedQuantity;
  console.log("store", store.numberOfItemsAvailable);
  await store.save();
};
// Update base cash
const updateBaseCash = async (amount, isIncrease) => {
  try {
    const baseCash = await _BaseCash.BaseCash.findOne();
    if (!baseCash) {
      throw new Error("Base cash value not found");
    }

    // Convert amount to a float
    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat)) {
      throw new Error("Invalid amount value");
    }
    if (isIncrease) {
      baseCash.value += amountFloat;
    } else {
      baseCash.value -= amountFloat;
    }
    await baseCash.save();
  } catch (error) {
    handleError(error);
  }
};