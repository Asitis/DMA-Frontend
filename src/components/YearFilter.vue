<template>
  <div class="year-filter filter">
    <div class="dropdown">
      <div class="dropdown-input" @click="toggleDropdown">
        <input
          type="text"
          v-model="search"
          placeholder="Search years"
          @focus="isDropdownOpen = true"
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

export default {
  data() {
    return {
      years: [],
      search: '',
      isDropdownOpen: false,
    };
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
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectYear(year) {
      console.log(year);
      this.search = year;
      this.isDropdownOpen = false;
      this.$emit('year-selected', year);
      this.$router.push({ name: 'Year', params: { name: year }});
    },
  },
};
</script>

<style scoped lang="less">
@import '@/assets/filters.less';
</style>