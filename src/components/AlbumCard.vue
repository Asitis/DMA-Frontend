<template>
  <div v-if="album" class="album-card">
    <div class="cover-container">
      <div v-if="album.acf.spotify_uri" class="spotify">
        <iframe :src="'https://embed.spotify.com/?uri=' + album.acf.spotify_uri" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>
      </div>
      <img v-if="album.featuredImageUrl" :src="album.featuredImageUrl" alt="Album cover" class="cover">
    </div>
    <div class="album-content">
      <h2 v-html="album.title.rendered"></h2>
      <router-link class="artistLink" :to="{ name: 'Artist', params: { name: artistDisplay } }">
        <div class="artist"><span v-html="artistDisplay"></span></div>
      </router-link>
      <p v-if="album.acf">{{ album.acf.notes }}</p>
    </div>
    <div class="card-end">
      <div class="year">
        <label>Year: </label> 
        <router-link :to="{ name: 'Year', params: { name: yearDisplay } }">
          <span v-html="yearDisplay"></span>
        </router-link>
      </div>
      <div class="labels">
        <label>Label: </label> 
          <router-link :to="{ name: 'Label', params: { name: labelDisplay } }">
            <span v-html="labelDisplay"></span>
          </router-link>
      </div>
      <div v-if="album.genres">
        <label>Genres: </label>
        <span v-html="genresDisplay"></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@/assets/album.less';
</style>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  album: {
    type: Object,
    required: true,
  }
});

// Helper function to join if array or return the value directly.
const formatData = (data) => {
  return Array.isArray(data) ? data.join(', ') : data;
};

const artistDisplay = computed(() => formatData(props.album.artist));
const yearDisplay = computed(() => formatData(props.album.jaren));
const labelDisplay = computed(() => formatData(props.album.labels));
const genresDisplay = computed(() => formatData(props.album.genres));
</script>