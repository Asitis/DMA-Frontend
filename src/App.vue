<script>
import { RouterLink, RouterView } from 'vue-router'
import { nextTick, ref, onMounted, onBeforeUnmount } from 'vue';
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
      selectedArtist: '',
      selectedGenre: '',
      selectedLabel: '',
      selectedYear: '',
    };
  },
  components: {
    ArtistFilter,
    GenreFilter,
    LabelFilter,
    YearFilter,
  },
  watch: {
    '$route'(to, from) {
      if (to.name === 'home' || to.path === '/') {
        this.clearFilters();
      }
    }
  },
  methods: {
    handleArtistSelected(artist) { this.selectedArtist = artist },
    handleGenreSelected(genre) { this.selectedGenre = genre },
    handleLabelSelected(label) { this.selectedLabel = label },
    handleYearSelected(year) { this.selectedYear = year },

    clearFilters(except) {
      //console.log('clearfilters called, except ' + except);
      nextTick(() => {
        if (except !== 'artist') { this.$refs.artistFilter.clearInput(); this.selectedArtist = null; this.artistSearch = ''; }
        if (except !== 'genre') { this.$refs.genreFilter.clearInput(); this.selectedGenre = null; this.genreSearch = ''; }
        if (except !== 'label') { this.$refs.labelFilter.clearInput(); this.selectedLabel = null; this.labelSearch = ''; }
        if (except !== 'year') { this.$refs.yearFilter.clearInput(); this.selectedYear = null; this.yearSearch = ''; }
      });
      //console.log(this.selectedArtist, this.selectedGenre, this.selectedLabel, this.selectedYear);
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
      <ArtistFilter ref="artistFilter" :search="artistSearch" @update-search="artistSearch = $event" @artist-selected="handleArtistSelected" />
      <GenreFilter ref="genreFilter" :search="genreSearch" @update-search="genreSearch = $event" @genre-selected="handleGenreSelected" />
      <LabelFilter ref="labelFilter" :search="labelSearch" @update-search="labelSearch = $event" @label-selected="handleLabelSelected" />
      <YearFilter ref="yearFilter" :search="yearSearch" @update-search="yearSearch = $event" @year-selected="handleYearSelected" />
    </footer>
  </div>
</template>

<style lang="less">
@import '@/assets/style.less';
</style>