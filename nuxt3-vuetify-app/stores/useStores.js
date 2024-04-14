import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useStoreStore = defineStore('storeStore', () => {
    const stores = ref([]);
    const isFetching = ref(false);

    async function fetchStores() {
        if (isFetching.value || stores.value.length > 0) return;
        isFetching.value = true;
        try {
            const response = await $fetch('https://buisness-mangment-system.onrender.com/api/store');
            stores.value = response;
        } catch (error) {
            console.error('Failed to fetch stores:', error);
        } finally {
            isFetching.value = false;
        }
    }

    return { stores, fetchStores };
});
