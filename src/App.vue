<script>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import ArtistFilter from '@/components/ArtistFilter.vue';

export default {
  components: {
    ArtistFilter,
  },
  methods: {
    handleArtistSelected(artist) {
      console.log('clicked');
      console.log(artist); // do something with the selected artist
    },
  },
};
</script>

<template>
  <div id="layout">
    <RouterView />
    <footer>
      <RouterLink to="/"><img src="@/assets/logo.svg" class="logo"></RouterLink>
      <ArtistFilter @artist-selected="handleArtistSelected" />
    </footer>
  </div>
</template>

<style>
@import '@/assets/style.less';
</style>