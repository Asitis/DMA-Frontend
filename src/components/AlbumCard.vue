<script setup>
defineProps({
  album: {
    type: Object,
    required: true,
  }
})
</script>

<template>
  <div class="album-card">
    <h2>{{ album.title.rendered }}</h2>
    <span>{{ album.acf.notes }}</span>
  </div>
</template>

<style scoped>
.album-card {
  padding: 20px;
  width: 100%;
  cursor: pointer;
  color: #fff;
  border: 1px solid #39495c;
  margin-bottom: 18px;
  box-sizing: border-box;
}
.album-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
</style>
