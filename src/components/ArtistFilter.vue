<template>
  <div class="artist-filter filter" ref="dropdownContainer">
    <div class="dropdown">
      <div class="dropdown-input" @click.stop>
        <input
          ref="artistInput"
          type="text"
          v-model="localSearch"
          placeholder="Search artist"
          @focus="handleInputFocus"
        />
        <i class="fas fa-search"></i>
      </div>
      <transition name="slide">
        <div class="dropdown-menu" v-if="isDropdownOpen">
          <div
            class="dropdown-item clearfix"
            v-for="(artist, index) in filteredArtists"
            :key="index"
            @click="selectArtist(artist.name)"
          >
            <span class="name" v-html="artist.name"></span> <span class="count">{{ artist.count }}</span>
          </div>
        </div>
      </transition>
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
      artists: [],
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
    AlbaService.getArtists().then((response) => {
      this.artists = response;
    });
  },
  computed: {
    filteredArtists() {
      return this.artists.filter((artist) => {
        return artist.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
      });
    },
  },
  mounted() {
    document.addEventListener('click', this.outsideClickListener);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.outsideClickListener);
  },
  methods: {
    handleInputFocus() {
      eventBus.emit(CLEAR_FILTERS_EXCEPT);
      this.isDropdownOpen = true;
    },
    selectArtist(artist) {
      eventBus.emit(CLEAR_FILTERS_EXCEPT, 'artist');
      this.localSearch = artist;
      this.isDropdownOpen = false;
      this.$emit('artist-selected', artist);
      this.$router.push({ name: 'Artist', params: { name: artist }});
    },
    clearInput() {
      this.$refs.artistInput.value = '';
    },
    outsideClickListener(event) {
      if (!this.$refs.dropdownContainer.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import '@/assets/filters.less';
</style>