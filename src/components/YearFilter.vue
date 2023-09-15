<template>
  <div class="year-filter filter" ref="dropdownContainer">
    <div class="dropdown">
      <div class="dropdown-input" @click.stop>
        <input
          ref="yearInput"
          type="text"
          v-model="localSearch"
          placeholder="Search years"
          @focus="handleInputFocus"
        />
        <i class="fas fa-search"></i>
      </div>
      <div class="dropdown-menu" v-if="isDropdownOpen">
        <div
          class="dropdown-item"
          v-for="(year, index) in filteredYears"
          :key="index"
          @click="selectYear(year)"
        >
          {{ year }}
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
      years: [],
      localSearch: this.search,
      isDropdownOpen: false,
    };
  },
  watch: {
    // Watch for changes to the incoming 'search' prop
    search(newVal) {
      this.localSearch = newVal;
    },
    // Watch for changes to the local data property
    localSearch(newVal) {
      this.$emit('update-search', newVal);
    }
  },
  created() {
    AlbaService.getYears().then((response) => {
      this.years = response;
    });
  },
  computed: {
    filteredYears() {
      return this.years.filter((year) => {
        return year.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
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
    selectYear(year) {
      eventBus.emit(CLEAR_FILTERS_EXCEPT, 'year');
      this.localSearch = year;
      this.isDropdownOpen = false;
      this.$emit('year-selected', year);
      this.$router.push({ name: 'Year', params: { name: year }});
    },
    clearInput() {
      this.$refs.yearInput.value = '';
    },
    outsideClickListener(event) {
      if (!this.$refs.dropdownContainer.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    }
  },
};
</script>

<style scoped lang="less">
@import '@/assets/filters.less';
</style>