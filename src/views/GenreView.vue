<template>
  <div class="alba" ref="albumList">
    <div class="intro-card genre">
      <RouterLink to="/" class="backBtn">&laquo;</RouterLink>
      <h1><span v-html="genre"></span></h1>
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
    AlbumCard
  },
  data() {
    return {
      genre: null,
      description: null,
      alba: []
    };
  },
  async created() {
    await this.fetchGenreData();
  },
  watch: {
    '$route.params.name': 'fetchGenreData'
  },
  methods: {
    async fetchGenreData() {
      const { name } = this.$route.params;
      const data = await AlbaService.getAlbumsByGenre(name);  // This function should fetch albums based on genre
      this.genre = data.genre.name;
      this.description = data.genre.description;  // Assuming you have a description for genres
      this.alba = data.alba;
    }
  }
}
</script>