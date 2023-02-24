<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
</script>

<template>
  <div id="layout">
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink> |
          <RouterLink to="/artist">Artist</RouterLink>
        </nav>
      </div>
    </header>
    <h1>DMA Vue Test</h1>
    <RouterView />
  </div>
</template>

<style>
@import '@/assets/style.less';
</style>