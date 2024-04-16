import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
    state: () => ({
        stores: [],
        transactions: [],
        baseCash: 0
    }),
    actions: {
        async fetchStores() {
            try {
                const response = await $fetch('https://buisness-mangment-system.onrender.com/api/store');
                this.stores = response.map(store => ({
                    ...store,
                    numberOfItemsAvailable: store.numberOfItemsAvailable
                }));
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        },
        async fetchTransactions() {
            try {
                const response = await $fetch('https://buisness-mangment-system.onrender.com/api/transactions');
                this.transactions = response.map(transaction => ({
                    ...transaction,
                    storeName: this.findStoreName(transaction.store)
                }));
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        },
        async fetchBaseCash() {
            try {
                const response = await $fetch('https://buisness-mangment-system.onrender.com/api/cash');
                this.baseCash = response.value;
            } catch (error) {
                console.error('Error fetching base cash:', error);
            }
        },
        findStoreName(storeId) {
            const store = this.stores.find(s => s._id === storeId);
            return store ? store.name : 'Unknown Store';
        }
    }
});
