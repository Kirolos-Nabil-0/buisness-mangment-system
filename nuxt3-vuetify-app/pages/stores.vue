<template>
    <v-container>
        <!-- الرأس -->
        <h2>

            ادارة المخازن
        </h2>

        <!-- تخطيط الشبكة لاستجابة الشاشات -->
        <v-row>
            <v-col cols="12" md="6">
                <!-- نموذج لإضافة/تحديث الصنف -->
                <v-form>
                    <v-text-field v-model="store.name" label="اسم الصنف" outlined dense></v-text-field>
                    <v-text-field v-model="store.numberOfItemsAvailable" label="عدد العناصر المتاحة" type="number"
                        outlined dense></v-text-field>
                    <v-btn @click="saveStore">حفظ الصنف</v-btn>
                </v-form>
            </v-col>
        </v-row>

        <!-- جدول عرض الأصناف -->
        <v-data-table :headers="headers" :items="stores" item-key="id">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.name }}</td>
                    <td>{{ item.numberOfItemsAvailable }}</td>
                    <td>{{ item.totalValue.toFixed(2) }}</td>
                    <v-btn icon color="blue" @click="editStore(item)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon color="red" @click="deleteStore(item)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </tr>
            </template>
        </v-data-table>
    </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const store = ref({
    name: '',
    numberOfItemsAvailable: 0
});

const stores = ref([]);

const headers = ref([
    { title: 'اسم الصنف', value: 'name' },
    { title: 'عدد العناصر', value: 'numberOfItemsAvailable' },
    { title: 'قيمة المعاملات', value: 'totalValue' },
    { title: 'الإجراءات', value: 'actions', sortable: false },
]);

async function fetchStoresAndTransactions() {
    try {
        const [storesResponse, transactionsResponse] = await Promise.all([
            $fetch('https://buisness-mangment-system.onrender.com/api/store'),
            $fetch('https://buisness-mangment-system.onrender.com/api/transactions')
        ]);


        const storesWithTotal = storesResponse.map(store => ({
            ...store,
            totalValue: transactionsResponse
                .filter(transaction => transaction.store === store._id)
                .reduce((acc, transaction) => acc + transaction.value, 0)
        }));

        stores.value = storesWithTotal;
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

onMounted(fetchStoresAndTransactions);

const saveStore = async () => {
    const method = store.value._id ? 'PUT' : 'POST';
    const url = `https://buisness-mangment-system.onrender.com/api/store${store.value._id ? '/' + store.value._id : ''}`;

    await $fetch(url, {
        method: method,
        body: store.value
    });

    store.value = { name: '', numberOfItemsAvailable: 0 };
    fetchStoresAndTransactions();
};

const editStore = item => {
    store.value = { ...item };
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const deleteStore = async item => {
    if (confirm(`هل أنت متأكد من أنك تريد حذف ${item.name}?`)) {
        await $fetch(`https://buisness-mangment-system.onrender.com/api/store/${item.id}`, {
            method: 'DELETE'
        });
        fetchStoresAndTransactions();
    }
};
</script>