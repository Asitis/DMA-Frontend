<template>
    <div class="genre-filter filter" ref="dropdownContainer">
        <div class="dropdown">
            <div class="dropdown-input" @click.stop>
                <input
                    ref="genreInput"
                    type="text"
                    v-model="localSearch"
                    placeholder="Search genres"
                    @focus="handleInputFocus"
                />
                <i class="fas fa-search"></i>
            </div>
            <transition name="slide">
                <div class="dropdown-menu" v-if="isDropdownOpen">
                    <div
                        class="dropdown-item clearfix"
                        v-for="(genre, index) in filteredGenres"
                        :key="index"
                        @click="selectGenre(genre.name)"
                    >
                        <span class="name" v-html="genre.name"></span>
                        <span class="count">{{ genre.count }}</span>
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
            default: '',
        },
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
        },
    },
    created() {
        this.localSearch = this.search;
        AlbaService.getGenres().then((response) => {
            this.genres = response;
        });
    },
    computed: {
        filteredGenres() {
            return this.genres.filter((genre) => {
                return (
                    genre.name
                        .toLowerCase()
                        .indexOf(this.search.toLowerCase()) !== -1
                );
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
        selectGenre(genre) {
            eventBus.emit(CLEAR_FILTERS_EXCEPT, 'genre');
            this.localSearch = genre;
            this.isDropdownOpen = false;
            this.$emit('genre-selected', genre);
            this.$router.push({ name: 'Genre', params: { name: genre } });
        },
        clearInput() {
            this.$refs.genreInput.value = '';
        },
        outsideClickListener(event) {
            if (!this.$refs.dropdownContainer.contains(event.target)) {
                this.isDropdownOpen = false;
            }
        },
    },
};
</script>

<style scoped lang="less">
@import '@/assets/filters.less';
</style>