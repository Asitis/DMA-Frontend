<template>
  <div class="label-filter filter">
    <div class="dropdown">
      <div class="dropdown-input" @click="toggleDropdown">
        <input
          type="text"
          v-model="search"
          placeholder="Search labels"
          @focus="isDropdownOpen = true"
        />
        <i class="fas fa-search"></i>
      </div>
      <div class="dropdown-menu" v-if="isDropdownOpen">
        <div
          class="dropdown-item"
          v-for="(label, index) in filteredLabels"
          :key="index"
          @click="selectLabel(label)"
        >
          {{ label }}
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
      labels: [],
      search: '',
      isDropdownOpen: false,
    };
  },
  created() {
    AlbaService.getLabels().then((response) => {
      this.labels = response;
    });
  },
  computed: {
    filteredLabels() {
      return this.labels.filter((label) => {
        return label.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
      });
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectLabel(label) {
      this.search = label;
      this.isDropdownOpen = false;
      this.$emit('label-selected', label);
      this.$router.push({ name: 'Label', params: { name: label }});
    },
  },
};
</script>

<style scoped lang="less">
@import '@/assets/filters.less';
</style>