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
    <album-content>
      <img v-if="album.featuredImageUrl" :src="album.featuredImageUrl" alt="Album cover" class="cover">
      <h2>{{ album.title.rendered }}</h2>
      <p>{{ album.acf.notes }}</p>
      <p>Artist: {{ album.artist }}</p>
      <p>Genres: {{ album.genres.join(', ') }}</p>
      <p>Jaren: {{ album.jaren }}</p>
    </album-content>
  </album>
</template>

<style scoped>
album {
  display: flex;
  flex-direction: column;
  padding: 5px;
  width: 25%;
  cursor: pointer;
  color: #fff;
  margin-bottom: 18px;
  box-sizing: border-box;
  transition: transform .4s;
}
album-content {
  display: flex;
  flex-direction: column;
  border: 1px solid #39495c;
  border-top: 0px;
  height: 100%;
}
img.cover { width: 100%; }
album:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
</style>
