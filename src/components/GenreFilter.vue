<template>
  <div class="genre-filter filter">
    <div class="dropdown">
      <div class="dropdown-input" @click="toggleDropdown">
        <input
          type="text"
          v-model="search"
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

export default {
  data() {
    return {
      genres: [],
      search: '',
      isDropdownOpen: false,
    };
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
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectGenre(genre) {
      this.search = genre;
      this.isDropdownOpen = false;
      this.$emit('genre-selected', genre);
      this.$router.push({ name: 'Genre', params: { name: genre }});
    },
  },
};
</script>

<style scoped lang="less">
@import '@/assets/filters.less';
</style>