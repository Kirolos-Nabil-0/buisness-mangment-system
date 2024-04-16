<template>
    <v-container>
        <!-- تخطيط الشبكة لاستجابة الشاشات -->
        <v-row>
            <v-col cols="12" md="6">
                <!-- نموذج لإضافة/تحديث المعاملات -->
                <v-form>
                    <div class="select-container">
                        <select v-model="transaction.storeId">
                            <option v-for="store in storeItems" :value="store.store" :key="store.store">{{ store.name }}
                            </option>
                        </select>
                    </div>
                    <v-text-field v-model="transaction.value" label="قيمة المعاملة" type="number" outlined
                        dense></v-text-field>
                    <v-text-field v-model="transaction.quantity" label="كمية العناصر" type="number" outlined
                        dense></v-text-field>
                    <div class="select-container">

                        <select v-model="transaction.type">
                            <option disabled default value="">اختر نوع المعاملة</option>
                            <option value="purchase">شراء</option>
                            <option value="sale">بيع</option>
                        </select>
                    </div>
                    <v-btn @click="handleSaveTransaction">حفظ المعاملة</v-btn>
                </v-form>
            </v-col>
            <v-col cols="12" md="6">
                <v-card class="elevation-2">
                    <v-card-title>
                        مخزون المتاجر
                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="بحث" single-line
                            hide-details></v-text-field>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :headers="storeHeaders" :items="storeItems" :search="search" class="elevation-1">
                            <template v-slot:item="{ item }">
                                <tr>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.numberOfItemsAvailable }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <v-card outlined>
                    <v-card-title>قيمة المخزن</v-card-title>
                    <v-card-text>
                        القيمة: {{ baseCash.value }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <!-- جدول عرض المعاملات -->
        <v-data-table :headers="transactionHeaders" :items="transactions" item-key="id">
            <template v-slot:item.actions="{ item }">
                <v-btn icon color="blue" @click="handleEditTransaction(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="red" @click="handleDeleteTransaction(item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>


            </template>

        </v-data-table>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import localforage from 'localforage';

const storeItems = ref([]);
const transactions = ref([]);
const baseCash = ref({ value: 0 });
const search = ref('');
const transaction = ref({
    storeId: '',
    value: 0,
    quantity: 0,
    type: ''
});
const networkOnline = ref(navigator.onLine);  // Track network status

const cleanForStorage = (data) => {
    return JSON.parse(JSON.stringify(data));
};

const findStoreName = (storeId) => {
    const store = storeItems.value.find(s => s._id === storeId);
    return store ? store.name : 'Unknown Store';
};

// Use this function when setting items to localForage
localforage.setItem('stores', cleanForStorage(storeItems.value));


const storeHeaders = ref([
    { title: 'اسم المتجر', value: 'name' },
    { title: 'عدد العناصر', value: 'numberOfItemsAvailable' }
]);

const transactionHeaders = ref([
    { title: 'اسم الصنف', value: 'storeName' },
    { title: 'قيمة المعاملة', value: 'value' },
    { title: 'كمية العناصر', value: 'quantity' },
    { title: 'نوع المعاملة', value: 'type' },
    { title: 'الإجراءات', value: 'actions', sortable: false }
]);
async function fetchStores() {
    try {
        const response = await fetch('https://buisness-mangment-system.onrender.com/api/store');
        const data = await response.json();
        storeItems.value = data.map(store => ({
            _id: store._id,
            store: store._id,
            name: store.name,
            numberOfItemsAvailable: store.numberOfItemsAvailable
        }));
        await localforage.setItem('stores', cleanForStorage(storeItems.value));
    } catch (error) {
        console.error('Network error fetching stores, using cached data:', error);
        storeItems.value = await localforage.getItem('stores') || [];
    }
}
window.addEventListener('online', () => {
    networkOnline.value = true;
    syncPendingTransactions();
    fetchStores();
    fetchTransactions();
    fetchBaseCash();
});

window.addEventListener('offline', () => {
    networkOnline.value = false;
});

const fetchTransactions = async () => {
    try {
        const response = await fetch('https://buisness-mangment-system.onrender.com/api/transactions');
        const data = await response.json();
        transactions.value = data.map(t => ({
            ...t,
            storeName: findStoreName(t.store)
        }));
        localforage.setItem('transactions', transactions.value); // Cache transactions
    } catch (error) {
        console.error('Error fetching transactions, using cached data:', error);
        transactions.value = await localforage.getItem('transactions') || [];
    }
};

const fetchBaseCash = async () => {
    try {
        const response = await fetch('https://buisness-mangment-system.onrender.com/api/cash');
        const cashData = await response.json();
        baseCash.value = cashData || { value: 0 }; // Ensure default object structure
        localforage.setItem('baseCash', baseCash.value);
    } catch (error) {
        console.error('Error fetching base cash, using cached data:', error);
        baseCash.value = await localforage.getItem('baseCash') || { value: 0 };
    }
};

async function handleSaveTransaction() {
    if (!networkOnline.value) {
        // Save pending transactions to local storage
        cacheTransactionForLater(transaction.value);
        alert('Saved locally: No internet connection. Will sync when online.');
        return;
    }
    const method = transaction.value._id ? 'PUT' : 'POST';
    const url = `https://buisness-mangment-system.onrender.com/api/transactions${transaction.value._id ? `/${transaction.value._id}` : ''}`;
    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction.value)
        });
        transaction.value = { storeId: '', value: 0, quantity: 0, type: '' };
        await fetchTransactions(); // Update cached data
        await fetchBaseCash();
    } catch (error) {
        console.error('Error saving transaction, caching for later sync:', error);
        cacheTransactionForLater(transaction.value);
    }
}

function cacheTransactionForLater(transaction) {
    localforage.getItem('pendingTransactions').then(pending => {
        const updates = pending || [];
        updates.push(cleanForStorage(transaction));
        localforage.setItem('pendingTransactions', updates);
    });
}

// Add functionality to check for and sync pending transactions when online
window.addEventListener('online', syncPendingTransactions);
async function syncPendingTransactions() {
    const pendingTransactions = await localforage.getItem('pendingTransactions') || [];
    for (let txn of pendingTransactions) {
        transaction.value = txn;
        handleSaveTransaction(); // Be sure to modify this function to be usable like this
    }
    localforage.setItem('pendingTransactions', []);
}

onMounted(async () => {
    if (networkOnline.value) {
        await fetchStores();
        await fetchTransactions();
        await fetchBaseCash();
    } else {
        // Load from cache if offline
        storeItems.value = await localforage.getItem('stores') || [];
        transactions.value = await localforage.getItem('transactions') || [];
        baseCash.value = await localforage.getItem('baseCash') || { value: 0 };
    }
});
</script>

<style scoped>
.select-container {
    margin: 10px 0;
    position: relative;
}

.select-container select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background-color: white;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

.select-container::after {
    content: '▼';
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    pointer-events: none;
}

.v-card-title {
    display: flex;
    align-items: center;
}

.v-text-field {
    max-width: 250px;
}
</style>
