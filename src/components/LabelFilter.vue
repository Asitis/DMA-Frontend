<template>
  <div class="label-filter filter" ref="dropdownContainer">
    <div class="dropdown">
      <div class="dropdown-input" @click.stop>
        <input
          ref="labelInput"
          type="text"
          v-model="localSearch"
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
          @click.stop="selectLabel(label)"
        >
          {{ label }}
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
      labels: [],
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
  mounted() {
    document.addEventListener('click', this.outsideClickListener);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.outsideClickListener);
  },
  methods: {
    selectLabel(label) {
      eventBus.emit(CLEAR_FILTERS_EXCEPT, 'Label');
      this.localSearch = label;
      this.isDropdownOpen = false;
      this.$emit('label-selected', label);
      this.$router.push({ name: 'Label', params: { name: label }});
    },
    clearInput() {
      this.$refs.labelInput.value = '';
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