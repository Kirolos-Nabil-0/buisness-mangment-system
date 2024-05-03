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
import { ref, computed, onMounted } from 'vue';
import { debounce } from 'lodash-es';

const isSaving = ref(false);
const dialog = ref({ show: false, item: null });
const alert = ref({ show: false, type: 'success', message: '' });
const store = ref({ name: '', numberOfItemsAvailable: 0 });
const stores = ref([]);
const search = ref("");

const headers = ref([
    { title: 'اسم الصنف', value: 'name' },
    { title: 'عدد العناصر', value: 'numberOfItemsAvailable' },
    { title: 'قيمة المعاملات', value: 'totalValue' },
    { title: 'الإجراءات', value: 'actions', sortable: false },
]);

const debouncedSearch = ref("");

watch(search, debounce((newSearch) => {
    debouncedSearch.value = newSearch;
}, 300));

const filteredStores = computed(() => {
    return stores.value.filter((store) => {
        return store.name.toLowerCase().includes(debouncedSearch.value.toLowerCase()) ||
            store.numberOfItemsAvailable.toString().includes(debouncedSearch.value) ||
            store.totalValue.toFixed(2).includes(debouncedSearch.value);
    });
});

const cachedTransactions = ref({});

async function fetchStoresAndTransactions() {
    try {
        const storesResponse = await $fetch('https://buisness-mangment-system.onrender.com/api/store');
        if (!cachedTransactions.value.date || new Date() - cachedTransactions.value.date > 300000) { // cache expiration: 5 minutes
            const transactionsResponse = await $fetch('https://buisness-mangment-system.onrender.com/api/transactions');
            cachedTransactions.value = { data: transactionsResponse, date: new Date() };
        }

        const storesWithTotal = storesResponse.map(store => ({
            ...store,
            totalValue: cachedTransactions.value.data
                .filter(transaction => transaction.store === store._id)
                .reduce((acc, transaction) => {
                    if (transaction.type === "purchase") {
                        return acc + transaction.value
                    } else {
                        return acc - transaction.value
                    }
                }, 0)
        }));

        stores.value = storesWithTotal;
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

onMounted(fetchStoresAndTransactions);

const saveStore = debounce(async () => {
    const method = store.value._id ? 'PUT' : 'POST';
    const url = `https://buisness-mangment-system.onrender.com/api/store${store.value._id ? '/' + store.value._id : ''}`;

    await $fetch(url, {
        method: method,
        body: store.value
    });

    store.value = { name: '', numberOfItemsAvailable: 0 };
    fetchStoresAndTransactions();
}, 300);

const editStore = item => {
    store.value = { ...item };
    window.scrollTo({ top: 0, behavior: 'smooth' });
};


const confirmDelete = item => {
    dialog.value = { show: true, item };
};
const deleteStore = async item => {
    try {
        await $fetch(`https://buisness-mangment-system.onrender.com/api/store/${item._id}`, {
            method: 'DELETE'
        });
        alert.value = { show: true, type: 'success', message: 'تم حذف العنصر بنجاح' };
    } catch (error) {
        console.error('Error deleting item:', error);
        alert.value = { show: true, type: 'error', message: 'فشل في حذف العنصر' };
    } finally {
        dialog.value.show = false;  // Ensure the dialog is closed after the operation
        fetchStoresAndTransactions();
    }
};

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