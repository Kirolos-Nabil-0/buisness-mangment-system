<template>
  <v-app>
    <v-main>
      <NuxtPage />
      <v-bottom-navigation>
        <!-- Store Button -->
        <v-btn value="recent" to="/stores">
          <v-icon left>mdi-history</v-icon>
          <span>المخزن</span>
        </v-btn>

        <!-- Transactions Button -->
        <v-btn value="favorites" to="/transactions">
          <v-icon left>mdi-heart</v-icon>
          <span>التعاملات</span>
        </v-btn>
      </v-bottom-navigation>
    </v-main>
  </v-app>
</template>

<script setup>
import '@mdi/font/css/materialdesignicons.css';
</script>
