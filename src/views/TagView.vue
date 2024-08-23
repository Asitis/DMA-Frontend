<template>
    <div class="alba" ref="albumList">
        <div class="intro-card label">
            <RouterLink to="/" class="backBtn">&laquo;</RouterLink>
            <h1><span v-html="label"></span></h1>
            <p><span v-html="description"></span></p>
        </div>

        <AlbumCard v-for="album in alba" :key="album.id" :album="album" />
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
            tag: null,
            description: null,
            alba: [],
        };
    },
    async created() {
        await this.fetchTagData();
    },
    watch: {
        '$route.params.name': 'fetchTagData',
    },
    methods: {
        async fetchTagData() {
            const { name } = this.$route.params;
            const data = await AlbaService.getAlbumsByTag(name);
            this.label = data.tag.name;
            this.description = data.tag.description;
            this.alba = data.alba;
        },
    },
};
</script>