<template>
  <div class="genre-filter filter">
    <div class="dropdown">
      <div class="dropdown-input">
        <input
          ref="genreInput"
          type="text"
          v-model="localSearch"
          placeholder="Search genres"
          @focus="isDropdownOpen = true"
        />
        <i class="fas fa-search"></i>
      </div>
      <div class="dropdown-menu" v-if="isDropdownOpen">
        <div
          class="dropdown-item"
          v-for="(genre, index) in filteredGenres"
          :key="index"
          @click="selectGenre(genre)"
        >
          {{ genre }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlbaService from '@/services/AlbaService.js';
import { eventBus } from '@/utils/EventBus.js';
const CLEAR_FILTERS_EXCEPT = 'clear-filters-except';
export default {
  props: {
    search: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      genres: [],
      localSearch: this.search,
      isDropdownOpen: false,
    };
  },
  watch: {
    search(newVal) {
      this.localSearch = newVal;
    },
    localSearch(newVal) {
      this.$emit('update-search', newVal);
    }
  },
  created() {
    AlbaService.getGenres().then((response) => {
      this.genres = response;
    });
  },
  computed: {
    filteredGenres() {
      return this.genres.filter((genre) => {
        return genre.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
      });
    },
  },
  methods: {
    selectGenre(genre) {
      eventBus.emit(CLEAR_FILTERS_EXCEPT, 'genre');
      this.localSearch = genre;
      this.isDropdownOpen = false;
      this.$emit('genre-selected', genre);
      this.$router.push({ name: 'Genre', params: { name: genre }});
    },
    clearInput() {
      this.$refs.genreInput.value = '';
    }
  },
};
</script>

<style scoped lang="less">
@import '@/assets/filters.less';
</style>