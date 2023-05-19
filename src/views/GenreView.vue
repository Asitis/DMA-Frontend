<template>
  <div class="alba" ref="albumList">
        <div class="intro-card artist">
      <h1>{{ genre }}</h1>
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
      genre: null,
      description: null,
      alba: []
    }
  },
  async created() {
    const { name } = this.$route.params;
    const data = await AlbaService.getAlbumsByGenre(name);
    this.genre = data.genre.name;
    this.description = data.genre.description;  // This line is to get the description of the genre.
    this.alba = data.alba;
  }
}
</script>