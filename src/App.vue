<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
// import AlbumCard from './components/AlbumCard.vue'

// export default {
//   components: { AlbumCard },
//   setup() {
//     const alba = ref([]);
//     const isLoading = ref(false);
//     const albumGenreNames = async (genres) => {
//       const genreNames = [];
//       for (const genre of genres) {
//         const response = await fetch(
//           `https://www.demaandagavond.nl/wp-json/wp/v2/genre/${genre}`
//         );
//         const genreData = await response.json();
//         genreNames.push(genreData.name);
//       }
//       return genreNames.length ? genreNames.join(", ") : "Unknown";
//     };

//     onMounted(async () => {
//       isLoading.value = true;

//       const response = await fetch(
//         "https://www.demaandagavond.nl/wp-json/wp/v2/dma_alba"
//       );

//       const data = await response.json();

//       alba.value = data;
//       isLoading.value = false;
//     });

//     return {
//       alba,
//       isLoading,
//       albumGenreNames,
//     };
//   },
// };
</script>

<template>
  <div id="layout">
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink> |
          <RouterLink to="/artist">Artist</RouterLink>
        </nav>
      </div>
    </header>
    <h1>DMA Vue Test</h1>
    <RouterView />
  </div>
</template>

<style>
body {
  background:#131920;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  margin-top: 60px;
}
#layout {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  padding: 30px;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav a.router-link-exact-active {
  color: #42b983;
}
h2 {
  font-size: 20px;
}
</style>
