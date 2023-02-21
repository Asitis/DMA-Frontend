<script setup>
import { ref, onMounted } from 'vue'
import AlbaService from '@/services/AlbaService.js'
import AlbumCard from '@/components/AlbumCard.vue'

const alba = ref(null)

onMounted(() => {
    AlbaService.getAlba()
    .then((response) => {
      alba.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })
})
</script>

<template>
    <div class="alba">
        <AlbumCard v-for="album in alba" :key="album.id" :album="album" />
    </div>
</template>

<style scoped>
.alba {
    display: block;
    column-count: 4;
}
</style>