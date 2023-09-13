<script>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { eventBus, CLEAR_FILTERS_EXCEPT } from '@/utils/EventBus.js';
import ArtistFilter from '@/components/ArtistFilter.vue';
import GenreFilter from '@/components/GenreFilter.vue';
import LabelFilter from '@/components/LabelFilter.vue';
import YearFilter from '@/components/YearFilter.vue';

export default {
  data() {
    return {
      artistSearch: '',
      genreSearch: '',
      labelSearch: '',
      yearSearch: '',
    };
  },
  components: {
    ArtistFilter,
    GenreFilter,
    LabelFilter,
    YearFilter,
  },
  methods: {
    handleArtistSelected(artist) {},
    handleGenreSelected(genre) {},
    handleLabelSelected(label) {},
    handleYearSelected(year) {},

    clearFilters(except) {
      console.log('clearfilters called');
        if (except !== 'artist') {
            this.selectedArtist = null;
        }
        if (except !== 'genre') {
            this.selectedGenre = null;
        }
        if (except !== 'label') {
            this.selectedLabel = null;
        }
        if (except !== 'year') {
            this.selectedYear = null;
        }
      // this.artistSearch = '';
      // this.genreSearch = '';
      // this.labelSearch = '';
      // this.yearSearch = '';
    }
  },
  created() {
    eventBus.on(CLEAR_FILTERS_EXCEPT, this.clearFilters);
  },
  beforeUnmount() {
    eventBus.off(CLEAR_FILTERS_EXCEPT, this.clearFilters);
  },
};
</script>

<template>
  <div id="layout">
    <RouterView />
    <footer>
      <RouterLink to="/"><img src="@/assets/logo.svg" class="logo"></RouterLink>
      <ArtistFilter :search="artistSearch" @update-search="artistSearch = $event" @artist-selected="handleArtistSelected" />
      <GenreFilter :search="genreSearch" @update-search="genreSearch = $event" @genre-selected="handleGenreSelected" />
      <LabelFilter :search="labelSearch" @update-search="labelSearch = $event" @label-selected="handleLabelSelected" />
      <YearFilter :search="yearSearch" @update-search="yearSearch = $event" @year-selected="handleYearSelected" />
    </footer>
  </div>
</template>

<style lang="less">
@import '@/assets/style.less';
</style>