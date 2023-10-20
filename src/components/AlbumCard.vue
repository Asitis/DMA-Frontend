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
            <div v-if="album.content.rendered">
                <span class="hasMore" @click="openOverlay">&#8943;</span>
            </div>

            <h2 v-html="album.title.rendered"></h2>
            <div class="artist">
                <span v-for="(artistItem, index) in artistDisplay" :key="index">
                    <router-link class="artistLink" :to="artistItem.link">
                        <span v-html="artistItem.name"></span>
                    </router-link>
                    <span v-if="index < artistDisplay.length - 1">, </span>
                </span>
            </div>
            <div class="overlay" v-if="showOverlay">
                <div class="context">
                    This is an old review found in the dusty archives. These
                    reviews were written somewhere between 2005 and 2015 and
                    mostly in Dutch.
                </div>
                <div class="content">
                    <h2 v-html="album.title.rendered"></h2>
                    <div class="artist">
                        <span
                            v-for="(artistItem, index) in artistDisplay"
                            :key="index">
                            <router-link
                                class="artistLink"
                                :to="artistItem.link">
                                <span v-html="artistItem.name"></span>
                            </router-link>
                            <span v-if="index < artistDisplay.length - 1">,
                            </span>
                        </span>
                    </div>

                    <div v-html="album.content.rendered"></div>
                    <span class="hasMore close" @click="closeOverlay">Close &#10537;</span>
                </div>
            </div>
            <p v-if="album.acf">{{ album.acf.notes }}</p>
            <div v-if="album.content && !album.acf.notes">
                <span class="badge">old</span>
                <p v-html="truncatedContent"></p>
            </div>
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
import { defineProps, computed, ref } from 'vue';
const props = defineProps({
    album: {
        type: Object,
        required: true,
    },
});

// Overlay
const showOverlay = ref(false);
const openOverlay = () => {
    showOverlay.value = true;
};
const closeOverlay = () => {
    showOverlay.value = false;
};
const maxLength = 300; // Adjust the maximum length as needed
const truncatedContent = computed(() => {
    if (props.album.content && !props.album.acf.notes) {
        const content = props.album.content.rendered;

        if (content.length <= maxLength) {
            return content;
        } else {
            const truncatedText = content.slice(0, maxLength);
            return truncatedText + '...';
        }
    }
    return ''; // Empty string if no truncated content should be displayed
});

// Data display
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