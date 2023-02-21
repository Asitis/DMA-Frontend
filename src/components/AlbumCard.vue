<script setup>
defineProps({
  album: {
    type: Object,
    required: true,
  }
})
</script>

<template>
  <div v-if="album" class="album-card">
    <h2>{{ album.title.rendered }}</h2>
    <img v-if="album.featuredImageUrl" :src="album.featuredImageUrl" alt="Album cover" class="cover">
    <p>{{ album.acf.notes }}</p>
    <p>Artist: {{ album.artist }}</p>
    <p>Genres: {{ album.genres.join(', ') }}</p>
    <p>Jaren: {{ album.jaren }}</p>
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
img.cover { width: 100%; }
.album-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
</style>
