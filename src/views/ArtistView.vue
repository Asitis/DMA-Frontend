<template>
  <div>
    <h1>{{ artist }}</h1>
    <AlbumCard v-for="album in alba" :key="album.id" :album="album" />
  </div>
</template>

<script>
import AlbaService from '@/services/AlbaService.js';

export default {
  data() {
    return {
      artist: null,
      albums: [],
    };
  },
  async created() {
    const { name } = this.$route.params;
    this.artist = name;
    const alba = await AlbaService.getAlbumsByArtist(name);
    this.alba = await Promise.all(alba);
    console.log(alba)
  }
};
</script>