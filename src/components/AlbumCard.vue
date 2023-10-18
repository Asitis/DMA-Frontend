<template>
    <div v-if="album" class="album-card">
        <div class="cover-container">
            <div v-if="album.acf.spotify_uri" class="spotify">
                <iframe
                    :src="
                        'https://embed.spotify.com/?uri=' +
                        album.acf.spotify_uri
                    "
                    width="100%"
                    height="80"
                    frameborder="0"
                    allowtransparency="true"
                ></iframe>
            </div>
            <img
                v-if="album.featuredImageUrl"
                :src="album.featuredImageUrl"
                alt="Album cover"
                class="cover"
            />
        </div>
        <div class="album-content">
            <h2 v-html="album.title.rendered"></h2>
            <div class="artist">
                <span v-for="(artistItem, index) in artistDisplay" :key="index">
                    <router-link class="artistLink" :to="artistItem.link">
                        <span v-html="artistItem.name"></span>
                    </router-link>
                    <span v-if="index < artistDisplay.length - 1">, </span>
                </span>
            </div>
            <p v-if="album.acf">{{ album.acf.notes }}</p>
        </div>
        <div class="card-end">
            <div class="year">
                <div>
                    <label>Year: </label>
                    <span v-for="(yearItem, index) in yearDisplay" :key="index">
                        <router-link :to="yearItem.link">{{
                            yearItem.name
                        }}</router-link>
                        <span v-if="index < yearDisplay.length - 1">, </span>
                    </span>
                </div>
            </div>
            <div class="labels">
                <div>
                    <label>Label: </label>
                    <span
                        v-for="(labelItem, index) in labelDisplay"
                        :key="index"
                    >
                        <router-link :to="labelItem.link">
                            <span v-html="labelItem.name"></span>
                        </router-link>
                        <span v-if="index < labelDisplay.length - 1">, </span>
                    </span>
                </div>
            </div>
            <div v-if="album.genres" class="genres">
                <div>
                    <label>Genres: </label>
                    <span
                        v-for="(genreItem, index) in genresDisplay"
                        :key="index"
                    >
                        <router-link :to="genreItem.link">
                            <span v-html="genreItem.name"></span>
                        </router-link>
                        <span v-if="index < genresDisplay.length - 1">, </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
@import '@/assets/album.less';
</style>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    album: {
        type: Object,
        required: true,
    },
});
const artistDisplay = computed(() => {
    return props.album.artist.map((artist) => {
        return {
            name: artist,
            link: { name: 'Artist', params: { name: artist } },
        };
    });
});
const yearDisplay = computed(() => {
    return props.album.jaren.map((jaren) => {
        return {
            name: jaren,
            link: { name: 'Year', params: { name: jaren } },
        };
    });
});
const labelDisplay = computed(() => {
    return props.album.labels.map((label) => {
        return {
            name: label,
            link: { name: 'Label', params: { name: label } },
        };
    });
});
const genresDisplay = computed(() => {
    return props.album.genres.map((genre) => {
        return {
            name: genre,
            link: { name: 'Genre', params: { name: genre } },
        };
    });
});
</script>