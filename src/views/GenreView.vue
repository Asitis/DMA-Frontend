<template>
    <div class="alba" ref="albumList">
        <div class="intro-card genre">
            <RouterLink to="/" class="backBtn">&laquo;</RouterLink>
            <div v-if="genre">
                <h1><span v-html="genre"></span></h1>
                <p><span v-html="description"></span></p>
            </div>
            <div v-else>
                <h1>Wut?</h1>
                <p>Sorry, this genre is not found in my library (yet).</p>
            </div>
        </div>

        <AlbumCard v-for="album in alba" :key="album.id" :album="album" />
        <div ref="loadMore" class="load-more">
            Loading
            <div class="loadingio-spinner-disk-v6bdvx4mffa">
                <div class="spinnerLoader">
                    <div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AlbaService from '@/services/AlbaService.js';
import AlbumCard from '@/components/AlbumCard.vue';

export default {
    components: {
        AlbumCard,
    },
    data() {
        return {
            genre: null,
            description: null,
            alba: [],
            page: 1,
            perPage: 30,
            isFetching: false,
        };
    },
    async created() {
        await this.fetchGenreData();
    },
    watch: {
        '$route.params.name': 'fetchGenreData',
    },
    methods: {
        async fetchGenreData() {
        AlbaService.cachedGenre = null;
        this.page = 1; // Reset page number for new genre
        this.alba = []; // Clear previous albums when loading a new genre
            const { name } = this.$route.params;
            const data = await AlbaService.getAlbumsByGenre(
                name,
                this.page,
                this.perPage
            );

            this.genre = data.genre.name;
            this.description = data.genre.description;
            this.alba = [...this.alba, ...data.alba]; // Append new albums to existing ones
        },
        async fetchMoreAlbaByGenre() {
            this.isFetching = true;
            const { name } = this.$route.params;
            try {
                const { alba: moreAlba } = await AlbaService.getAlbumsByGenre(
                    name,
                    this.page,
                    this.perPage
                );
                if (Array.isArray(moreAlba)) {
                    this.alba = [...this.alba, ...moreAlba];
                    this.page++;
                } else {
                    console.error('Received non-iterable data');
                }
            } catch (error) {
                console.error(error);
            }
            this.isFetching = false;
        },
    },
    mounted() {
        const albumList = this.$refs.albumList;
        const options = {
            root: null,
            rootMargin: '200px 0px 200px 0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this.isFetching) {
                this.fetchMoreAlbaByGenre();
            }
        }, options);

        observer.observe(this.$refs.loadMore);
    },
};
</script>