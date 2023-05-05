<template>
  <div class="alba" ref="albumList">
        <div class="intro-card artist">
      <h1>{{ artist }}</h1>
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
      alba: []
    }
  },
  async created() {
    const { name } = this.$route.params;
    this.artist = name;
    this.alba = await AlbaService.getAlbumsByArtist(name);
  }
}
</script>