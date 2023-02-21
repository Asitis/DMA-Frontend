<template>
  <div class="container">
    <p v-if="isLoading">Loading...</p>
    <ul v-for="album in alba" :key="album.id">
      <h2>{{ album.title.rendered }}</h2>
      <p>Notes: {{ album.acf.notes }}</p>
      <p>Artist: {{ album.artist }}</p>
      <p>Genres {{ album.genre }}</p> 
      <p v-if="albumGenreNames">Genre Name: {{ albumGenreNames(album.genre) }}</p>      
      <p>Jaren: {{ album.jaren }}</p>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const alba = ref([]);
    const isLoading = ref(false);
    const albumGenreNames = async (genres) => {
      const genreNames = [];
      for (const genre of genres) {
        const response = await fetch(
          `https://www.demaandagavond.nl/wp-json/wp/v2/genre/${genre}`
        );
        const genreData = await response.json();
        genreNames.push(genreData.name);
      }
      return genreNames.length ? genreNames.join(", ") : "Unknown";
    };

    onMounted(async () => {
      isLoading.value = true;

      const response = await fetch(
        "https://www.demaandagavond.nl/wp-json/wp/v2/dma_alba"
      );

      const data = await response.json();

      alba.value = data;
      isLoading.value = false;
    });

    return {
      alba,
      isLoading,
      albumGenreNames,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
