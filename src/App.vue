<script>
import { RouterLink, RouterView } from 'vue-router';
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
            isFooterVisible: true,
        };
    },
    components: {
        ArtistFilter,
        GenreFilter,
        LabelFilter,
        YearFilter,
    },
    watch: {
        $route(to, from) {
            if (to.name === 'home' || to.path === '/') {
                this.clearFilters();
            }
        },
    },
    computed: {
        footerMargin() {
            return this.isFooterVisible ? '0' : '-195px';
        },
    },
    methods: {
        toggleFooter() {
            if (window.innerWidth <= 1280) {
                this.isFooterVisible = !this.isFooterVisible;
            }
        },
        handleArtistSelected(artist) {
            this.selectedArtist = artist;
        },
        handleGenreSelected(genre) {
            this.selectedGenre = genre;
        },
        handleLabelSelected(label) {
            this.selectedLabel = label;
        },
        handleYearSelected(year) {
            this.selectedYear = year;
        },
        clearFilters(except) {
            //console.log('clearfilters called, except ' + except);
            nextTick(() => {
                if (except !== 'artist') {
                    this.$refs.artistFilter.clearInput();
                    this.selectedArtist = null;
                    this.artistSearch = '';
                }
                if (except !== 'genre') {
                    this.$refs.genreFilter.clearInput();
                    this.selectedGenre = null;
                    this.genreSearch = '';
                }
                if (except !== 'label') {
                    this.$refs.labelFilter.clearInput();
                    this.selectedLabel = null;
                    this.labelSearch = '';
                }
                if (except !== 'year') {
                    this.$refs.yearFilter.clearInput();
                    this.selectedYear = null;
                    this.yearSearch = '';
                }
            });
            //console.log(this.selectedArtist, this.selectedGenre, this.selectedLabel, this.selectedYear);
        },
        checkScreenWidth() {
            if (window.innerWidth <= 1280) {
                const footer = document.getElementById('footer');
                if (footer) {
                    å;
                    footer.addEventListener('click', this.toggleFooter);
                }
                this.isFooterVisible = false;
            } else {
                const footer = document.getElementById('footer');
                if (footer) {
                    footer.removeEventListener('click', this.toggleFooter);
                }
                this.isFooterVisible = true;
            }
        },
    },
    created() {
        eventBus.on(CLEAR_FILTERS_EXCEPT, this.clearFilters);
    },
    mounted() {
        this.checkScreenWidth();
        window.addEventListener('resize', this.checkScreenWidth);
        if (footer) {
            footer.addEventListener('click', this.toggleFooter, { once: true });
        }
    },
    beforeUnmount() {
        eventBus.off(CLEAR_FILTERS_EXCEPT, this.clearFilters);
        window.removeEventListener('resize', this.checkScreenWidth);
    },
};
</script>

<template>
    <div id="layout">
        <RouterView />
        <footer id="footer" :style="{ marginBottom: footerMargin }">
            <RouterLink to="/"
                ><img src="@/assets/logo.svg" class="logo"
            /></RouterLink>
            <ArtistFilter
                ref="artistFilter"
                :search="artistSearch"
                @update-search="artistSearch = $event"
                @artist-selected="handleArtistSelected"
            />
            <GenreFilter
                ref="genreFilter"
                :search="genreSearch"
                @update-search="genreSearch = $event"
                @genre-selected="handleGenreSelected"
            />
            <LabelFilter
                ref="labelFilter"
                :search="labelSearch"
                @update-search="labelSearch = $event"
                @label-selected="handleLabelSelected"
            />
            <YearFilter
                ref="yearFilter"
                :search="yearSearch"
                @update-search="yearSearch = $event"
                @year-selected="handleYearSelected"
            />
        </footer>
    </div>
</template>

<style lang="less">
@import '@/assets/style.less';
#footer {
    transition: margin-bottom 0.3s ease; /* Adjust the duration and easing as needed */
}
</style>