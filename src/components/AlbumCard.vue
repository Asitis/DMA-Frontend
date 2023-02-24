<script setup>
defineProps({
  album: {
    type: Object,
    required: true,
  }
})
</script>

<template>
  <album v-if="album" class="album-card">
    <img v-if="album.featuredImageUrl" :src="album.featuredImageUrl" alt="Album cover" class="cover">
    <album-content>
      <h2 v-html="album.title.rendered"></h2>
      <artist>{{ album.artist }}</artist>
      <year>{{ album.jaren }}</year>
      <p>{{ album.acf.notes }}</p>
      <p>{{ album.genres.join(', ') }}</p>
    </album-content>
  </album>
</template>

<style scoped lang="less">
@import '@/assets/album.less';
</style>