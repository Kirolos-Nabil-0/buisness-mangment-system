<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card class="pa-3" elevation="2">
                    <v-card-title class="headline">ادارة المخازن</v-card-title>
                    <v-form @submit.prevent="saveStore">
                        <v-text-field v-model.trim="store.name" label="اسم الصنف" outlined dense
                            single-line></v-text-field>
                        <v-text-field v-model.number="store.numberOfItemsAvailable" label="عدد العناصر المتاحة"
                            type="number" outlined dense single-line></v-text-field>
                        <v-btn type="submit" color="primary" block :loading="isSaving">حفظ الصنف</v-btn>
                    </v-form>
                    <v-alert v-if="alert.show" :type="alert.type" dense dismissible @dismiss="alert.show = false">
                        {{ alert.message }}
                    </v-alert>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-2">
            <v-col cols="12">
                <v-text-field v-model="search" label="بحث" single-line clearable outlined></v-text-field>
                <v-data-table :headers="headers" :items="filteredStores" item-key="id" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.name }}</td>
                            <td>{{ item.numberOfItemsAvailable }}</td>
                            <td>{{ item.totalValue.toFixed(2) }}</td>
                            <td>
                                <v-btn icon color="blue" @click="editStore(item)">
                                    <v-icon large>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon color="red" @click="() => confirmDelete(item)">
                                    <v-icon large>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="dialog.show" persistent max-width="95vw">
            <v-card>
                <v-card-title class="text-h5">أكد الحذف</v-card-title>
                <v-card-text>هل انت متاكد انك تريد حذف هذا العنصر؟ هذه العملية لا يمكن الرجوع فيها.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog.show = false">الغاء</v-btn>
                    <v-btn color="red darken-1" text @click="deleteStore(dialog.item)">حذف</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import localforage from 'localforage';
import { debounce } from 'lodash-es';

const isSaving = ref(false);
const dialog = ref({ show: false, item: null });
const alert = ref({ show: false, type: 'success', message: '' });
const store = ref({ name: '', numberOfItemsAvailable: 0 });
const stores = ref([]);
const search = ref("");
const offlineActions = ref([]);

const headers = ref([
    { text: 'اسم الصنف', value: 'name' },
    { text: 'عدد العناصر', value: 'numberOfItemsAvailable' },
    { text: 'قيمة المعاملات', value: 'totalValue' },
    { text: 'الإجراءات', value: 'actions', sortable: false },
]);

const debouncedSearch = ref("");

watch(search, debounce((newSearch) => {
    debouncedSearch.value = newSearch;
}, 300));

const filteredStores = computed(() => {
    const searchLower = debouncedSearch.value.toLowerCase();
    return stores.value.filter(store => {
        const nameMatch = store.name.toLowerCase().includes(searchLower);
        const itemsAvailableMatch = store.numberOfItemsAvailable.toString().includes(debouncedSearch.value);
        const totalValueMatch = store.totalValue.toFixed(2).includes(debouncedSearch.value);
        return nameMatch || itemsAvailableMatch || totalValueMatch;
    });
});

onMounted(() => {
    fetchStoresAndTransactions().catch(error => {
        console.error("Failed to perform initial fetch:", error);
        alert.value = { show: true, type: 'error', message: 'Failed to load initial data. Check network connection.' };
    });
});

async function fetchStoresAndTransactions() {
    try {
        const storesResponse = await fetchStores();
        stores.value = processStores(storesResponse);
    } catch (error) {
        console.error("Failed to fetch data, using local cache:", error);
        loadStoresFromCache();
    }
}

async function fetchStores() {
    try {
        const response = await fetch('https://buisness-mangment-system.onrender.com/api/store');
        const data = await response.json();
        await localforage.setItem('stores', data); // Save to localforage
        return data;
    } catch (error) {
        console.error('Network error when fetching stores:', error);
        throw error;
    }
}

function processStores(data) {
    return data.map(store => ({
        ...store,
        totalValue: store.transactions && Array.isArray(store.transactions) ?
            store.transactions.reduce((acc, transaction) => acc + transaction.value, 0) : 0
    }));
}

function loadStoresFromCache() {
    localforage.getItem('stores').then(storedStores => {
        if (storedStores) {
            stores.value = processStores(storedStores);
            alert.value = { show: true, type: 'info', message: 'Loaded data from cache due to network error.' };
        } else {
            alert.value = { show: true, type: 'info', message: 'No data in cache.' };
        }
    }).catch(error => {
        console.error('Error loading stores from cache:', error);
        alert.value = { show: true, type: 'error', message: 'Failed to load cached data.' };
    });
}


async function saveStore() {
    if (!navigator.onLine) {
        await localforage.setItem('offline-actions', [...offlineActions.value, store.value]);
        alert.value = { show: true, type: 'info', message: 'No internet connection. Data saved locally and will sync when online.' };
        return;
    }
    isSaving.value = true;
    const method = store.value._id ? 'PUT' : 'POST';
    const url = `https://buisness-mangment-system.onrender.com/api/store${store.value._id ? '/' + store.value._id : ''}`;
    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(store.value)
        });
        fetchStoresAndTransactions();
    } catch (error) {
        console.error('Error saving item:', error);
        alert.value = { show: true, type: 'error', message: 'Failed to save. Please try again later.' };
    } finally {
        isSaving.value = false;
    }
}

onMounted(async () => {
    if (navigator.onLine) {
        fetchStoresAndTransactions().catch(console.error);
    } else {
        loadStoresFromCache();
    }
    syncOfflineActions();
});

async function syncOfflineActions() {
    const actions = await localforage.getItem('offline-actions');
    if (actions && actions.length > 0) {
        for (const action of actions) {
            // Attempt to re-save each offline action
            store.value = action;
            await saveStore();
        }
        await localforage.setItem('offline-actions', []);
    }
}
</script>


<style scoped>
.v-card {
    background-color: #fff;
    /* Adjusted for better readability on mobile */
}

.v-btn {
    margin-top: 5px;
    /* Smaller margin for compact layout */
}

.headline {
    font-size: 1.25rem;
    /* Larger font for better visibility */
}

.v-icon.large {
    font-size: 30px;
    /* Larger icons for easier interaction */
}
</style>