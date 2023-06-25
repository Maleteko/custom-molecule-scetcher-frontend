<script setup>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { RouterLink, RouterView } from 'vue-router'
import MoleculeSVG from './components/MoleculeSVG.vue'
</script>

<template>
  <header>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
</style>
