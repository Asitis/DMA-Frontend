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
    <img v-if="album.featuredImageUrl" :src="album.featuredImageUrl" alt="Album cover" class="cover">
    <div class="album-content">
      <h2 v-html="album.title.rendered"></h2>
      <div class="artist">{{ album.artist }}</div>
      <div class="year">{{ album.jaren }}</div>
      <div class="labels">{{ album.labels }}</div>
      <p v-if="album.acf">{{ album.acf.notes }}</p>
      <p v-if="album.genres">{{ album.genres.join(', ') }}</p>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@/assets/album.less';
</style>