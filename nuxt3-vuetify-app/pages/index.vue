<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>مرحباً بكم في نظام إدارة المتاجر</h1>
                <p>إدارة متاجرك والمعاملات ومشاهدة حالة النقدية الحالية.</p>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="4">
                <v-card @click="goToStores" class="info-card">
                    <v-card-title>إدارة التصنيفات</v-card-title>
                    <v-card-text>عرض وإدارة جميع تصنيفات السلع الخاصة بك.</v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card @click="goToTransactions" class="info-card">
                    <v-card-title>المعاملات</v-card-title>
                    <v-card-text>إدارة معاملات البيع والشراء الخاصة بك.</v-card-text>
                </v-card>
            </v-col>
            <!-- 
            <v-col cols="12" md="4">
                <v-card @click="viewBaseCash" class="info-card">
                    <v-card-title>النقدية الأساسية</v-card-title>
                    <v-card-text>عرض حالة النقدية الأساسية الحالية.</v-card-text>
                </v-card>
            </v-col> -->
        </v-row>
    </v-container>
</template>



<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToStores = () => {
    router.push({ name: 'stores' }); // Replace 'stores' with the actual route name/path for your stores page
};

const goToTransactions = () => {
    router.push({ name: 'transactions' }); // Replace 'transactions' with the actual route name/path for your transactions page
};

const viewBaseCash = () => {
    router.push({ name: 'baseCash' }); // Replace 'baseCash' with the actual route name/path for your base cash page
};
</script>
<style scoped>
/* Add RTL support for Arabic */
html {
    direction: rtl;
}

.info-card {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.info-card:hover {
    transform: scale(1.05);
}
</style>
