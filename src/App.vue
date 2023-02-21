<template>
  <div class="container">
    <p v-if="isLoading">Loading...</p>
    <ul v-for="album in alba" :key="album.id">
      <h2>{{ album.title.rendered }}</h2>
      <p>Notes: {{ album.acf.notes }}</p>
      <p>Artist: {{ album.artist }}</p>
      <p>Genres {{ album.genre }}</p> 
      <p>Genre Name: {{ albumGenreName(album) }}</p>      
      <p>Jaren: {{ album.jaren }}</p>
    </ul>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const alba = ref([]);
    const isLoading = ref(false);

    const getGenreName = async (genres, genreId) => {
      const genre = genres.find((genre) => genre.id === genreId);
      if (genre) {
        const response = await fetch(
          `https://www.demaandagavond.nl/wp-json/wp/v2/genre/${genre}`
        );
        const genreData = await response.json();
        return genreData.name;
      } else {
        return null;
      }
    };

    const albumGenreName = computed(() => {
      return async (album) => {
        const genreName = await getGenreName(album.genre, 472);
        return genreName || 'Unknown';
      };
    });

    const getPosts = async () => {
      isLoading.value = true;
      const response = await fetch("https://www.demaandagavond.nl/wp-json/wp/v2/dma_alba");
      const data = await response.json();
      alba.value = data;
      isLoading.value = false;
    };

    onMounted(() => {
      getPosts();
    });

    return {
      alba,
      isLoading,
      albumGenreName,
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
