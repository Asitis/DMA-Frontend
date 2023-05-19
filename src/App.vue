<script>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import ArtistFilter from '@/components/ArtistFilter.vue';
import GenreFilter from '@/components/GenreFilter.vue';
import LabelFilter from '@/components/LabelFilter.vue';

export default {
  components: {
    ArtistFilter,
    GenreFilter,
    LabelFilter,
  },
  methods: {
    handleArtistSelected(artist) {},
    handleGenreSelected(genre) {},
    handleLabelSelected(label) {},
  },
};
</script>

<template>
  <div id="layout">
    <RouterView />
    <footer>
      <RouterLink to="/"><img src="@/assets/logo.svg" class="logo"></RouterLink>
      <ArtistFilter @artist-selected="handleArtistSelected" />
      <GenreFilter @genre-selected="handleGenreSelected" />
      <LabelFilter @label-selected="handleLabelSelected" />
    </footer>
  </div>
</template>

<style lang="less">
@import '@/assets/style.less';
</style>