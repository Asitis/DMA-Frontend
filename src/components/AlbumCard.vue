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
    <div class="cover-container">
      <img v-if="album.featuredImageUrl" :src="album.featuredImageUrl" alt="Album cover" class="cover">
    </div>
    <div class="album-content">
      <h2 v-html="album.title.rendered"></h2>
      <div class="artist">{{ album.artist.join(', ') }}</div>
      <p v-if="album.acf">{{ album.acf.notes }}</p>
    </div>
    <div class="card-end">
      <div class="year"><label>Year:</label> {{ album.jaren.join(', ') }}</div>
      <div class="labels"><label>Label:</label> {{ album.labels.join(', ') }}</div>
      <div v-if="album.genres"><label>Genres:</label> {{ album.genres.join(', ') }}</div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@/assets/album.less';
</style>