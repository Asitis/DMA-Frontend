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
export default {
  data() {
    return {
      alba: [],
      isLoading: false,
    };
  },
  methods: {
    async getGenreName(genres, genreId) {
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
    },
  },
  computed: {
    albumGenreName() {
      return async (album) => {
        const genreName = await this.getGenreName(album.genre, 472);
        return genreName || 'Unknown';
      };
    },
  },
  mounted() {
    this.isLoading = true;
    fetch("https://www.demaandagavond.nl/wp-json/wp/v2/dma_alba")
      .then((response) => response.json())
      .then((data) => {
        this.alba = data;
        this.isLoading = false;
      });
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
