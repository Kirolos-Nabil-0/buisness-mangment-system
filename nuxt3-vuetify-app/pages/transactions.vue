<template>
    <v-container>
        <v-row>
            <!-- Make columns full width on smaller screens -->
            <v-col cols="12" sm="6" md="4">
                <v-form>
                    <div class="select-container">
                        <select v-model="transaction.storeId">
                            <option v-for="store in storeItems" :value="store.store" :key="store.store">
                                {{ store.name }}
                            </option>
                        </select>
                    </div>
                    <v-text-field v-model="transaction.value" label="قيمة المعاملة" type="number"
                        :rules="[v => !!v || 'Value is required']" outlined dense required auto-focus>
                    </v-text-field>
                    <v-text-field v-model="transaction.quantity" label="كمية العناصر" type="number" outlined dense>
                    </v-text-field>
                    <div class="select-container">
                        <select v-model="transaction.type">
                            <option disabled value="">اختر نوع المعاملة</option>
                            <option value="purchase">شراء</option>
                            <option value="sale">بيع</option>
                        </select>
                    </div>
                    <v-btn block color="primary" @click="handleSaveTransaction">حفظ المعاملة</v-btn>
                </v-form>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card class="elevation-2">
                    <v-card-title>
                        مخزون المتاجر
                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="بحث" single-line hide-details>
                        </v-text-field>
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
            <v-col cols="12" sm="6">
                <v-card outlined>
                    <v-card-title>قيمة المخزن</v-card-title>
                    <v-card-text>
                        القيمة: {{ baseCash.value }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Transactions Table - Adjusted for mobile responsiveness -->
        <v-row>
            <v-col cols="12">
                <v-data-table :headers="transactionHeaders" :items="transactions" item-key="id" mobile-breakpoint="500">
                    <template v-slot:item.actions="{ item }">
                        <v-btn icon color="blue" @click="handleEditTransaction(item)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="handleDeleteTransaction(item)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { debounce } from 'lodash-es'; // Make sure lodash-es is installed

const search = ref('');
const debouncedSearch = ref('');

watch(search, debounce((newValue) => {
    debouncedSearch.value = newValue;
}, 300));

const transaction = ref({
    storeId: '',
    value: 0,
    quantity: 0,
    type: ''
});

const storeItems = ref([]);
const transactions = ref([]);
const baseCash = ref({ value: 0 });
const storeHeaders = ref([
    { title: 'اسم المتجر', value: 'name' },
    { title: 'عدد العناصر', value: 'numberOfItemsAvailable' }
]);
const fetchBaseCash = async () => {
    try {
        const response = await $fetch('https://buisness-mangment-system.onrender.com/api/cash');
        baseCash.value = response;
    } catch (error) {
        console.error('Error fetching base cash:', error);
    }
};
const findStoreName = (storeId) => {
    console.log("items", storeItems.value);
    console.log("id", storeId);
    const store = storeItems.value.find(s => s._id === storeId);

    return store ? store.name : 'Unknown Store';
};
const transactionHeaders = ref([
    { title: 'اسم الصنف', value: 'storeName' },
    { title: 'قيمة المعاملة', value: 'value' },
    { title: 'كمية العناصر', value: 'quantity' },
    { title: 'نوع المعاملة', value: 'type' },
    { title: 'الإجراءات', value: 'actions', sortable: false }
]);

const fetchStores = async () => {
    try {
        const response = await $fetch('https://buisness-mangment-system.onrender.com/api/store');
        storeItems.value = response.map(store => ({
            _id: store._id,
            store: store._id,
            name: store.name,
            numberOfItemsAvailable: store.numberOfItemsAvailable  // Ensure this property is retrieved and stored


        }));
        console.log(storeItems.value);
    } catch (error) {
        console.error('Error fetching stores:', error);
    }
};

const fetchTransactions = async () => {
    try {
        const response = await $fetch('https://buisness-mangment-system.onrender.com/api/transactions');
        transactions.value = response.map(t => ({
            ...t,
            storeName: findStoreName(t.store)
        }));
        console.log(transactions.value);

    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

const handleSaveTransaction = async () => {
    try {
        const method = transaction.value._id ? 'PUT' : 'POST';
        const url = `https://buisness-mangment-system.onrender.com/api/transactions${transaction.value._id ? `/${transaction.value._id}` : ''}`;

        await $fetch(url, {
            method,
            body: transaction.value
        });

        transaction.value = { storeId: '', value: 0, quantity: 0, type: '' };
        console.log(transaction.value);
        await fetchTransactions();
        await fetchBaseCash();
    } catch (error) {
        console.error('Error saving transaction:', error);
        console.log(transaction.value);
    }
};

const handleEditTransaction = (item) => {
    transaction.value = { ...item };
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleDeleteTransaction = async (item) => {
    if (confirm(`هل أنت متأكد من أنك تريد حذف المعاملة ل ${item.storeId}?`)) {
        try {
            await $fetch(`https://buisness-mangment-system.onrender.com/api/transactions/${item._id}`, {
                method: 'DELETE'
            });
            await fetchTransactions();
            await fetchBaseCash();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    }
};

onMounted(async () => {
    await fetchStores();
    await fetchTransactions();
    await fetchBaseCash(); // Fetch base cash on component mount
    console.log(storeItems.value);
});
</script>
<style scoped>
.select-container {
    margin: 10px 0;
    position: relative;
    display: block;
    /* Adjust as necessary for mobile */
}

.select-container select {
    width: 100%;
    padding: 12px;
    /* Larger padding for easier interaction */
    border: 1px solid #ced4da;
    border-radius: 4px;
    background-color: white;
    -webkit-appearance: none;
    /* Remove default styling */
    -moz-appearance: none;
    appearance: none;
}

.v-btn {
    margin-top: 10px;
    /* More space around buttons */
}

.v-card-title,
.v-text-field {
    flex-direction: column;
    /* Stack elements vertically on smaller screens */
    align-items: start;
}

.v-text-field {
    max-width: 100%;
    /* Allow text fields to fill container on small screens */
}
</style>