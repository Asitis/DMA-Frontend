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
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink> |
          <RouterLink to="/artist">Artist</RouterLink>
        </nav>
      </div>
    </header>
    <RouterView />
    <footer>
      <img src="@/assets/logo.svg">
      <ArtistFilter @artist-selected="handleArtistSelected" />
    </footer>
  </div>
</template>

<style>
@import '@/assets/style.less';
</style>