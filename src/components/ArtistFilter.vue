<template>
  <div class="artist-filter">
    <div class="dropdown">
      <div class="dropdown-input" @click="toggleDropdown">
        <input
          type="text"
          v-model="search"
          placeholder="Search artist"
          @focus="isDropdownOpen = true"
        />
        <i class="fas fa-search"></i>
      </div>
      <div class="dropdown-menu" v-if="isDropdownOpen">
        <div
          class="dropdown-item"
          v-for="(artist, index) in filteredArtists"
          :key="index"
          @click="selectArtist(artist)"
        >
          {{ artist }}
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
      artists: [],
      search: '',
      isDropdownOpen: false,
    };
  },
  created() {
    AlbaService.getArtists().then((response) => {
      this.artists = response;
    });
  },
  computed: {
    filteredArtists() {
      return this.artists.filter((artist) => {
        return artist.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
      });
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectArtist(artist) {
      console.log('selectArtist fired');
      this.search = artist;
      this.isDropdownOpen = false;
      this.$emit('artist-selected', artist);
      this.$router.push({ name: 'Artist', params: { name: artist }});
    },
  },
};
</script>

<style scoped lang="less">
@import '@/assets/filters.less';
</style>