<script setup>
import { ref, onMounted } from 'vue'
import AlbaService from '@/services/AlbaService.js'
import AlbumCard from '@/components/AlbumCard.vue'

const alba = ref(null)

onMounted(() => {
  AlbaService.getAlba()
    .then(albums => {
      alba.value = albums
    })
    .catch(error => {
      console.log(error)
    })
})
</script>

<template>
  <div class="alba" v-if="alba">
    <AlbumCard v-for="album in alba" :key="album.id" :album="album" />
  </div>
</template>

<style scoped>
.alba {
    display: block;
    column-count: 3;
}
</style>