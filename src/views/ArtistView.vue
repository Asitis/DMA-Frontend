<template>
  <div class="alba" ref="albumList">
    <div class="intro-card artist">
      <RouterLink to="/" class="backBtn">&laquo;</RouterLink>
      <h1>{{ artist }}</h1>
      <p>{{ description }}</p>
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
      artist: null,
      description: null,
      alba: []
    }
  },
  async created() {
    await this.fetchArtistData();
  },
  watch: {
    '$route.params.name': 'fetchArtistData'
  },
  methods: {
    async fetchArtistData() {
      const { name } = this.$route.params;
      const data = await AlbaService.getAlbumsByArtist(name);
      this.artist = data.artist.name;
      this.description = data.artist.description;
      this.alba = data.alba;
    }
  }
}
</script>