<template>
  <div class="alba" ref="albumList">
    <AlbumCard v-for="album in alba" :key="album.id" :album="album" />
    <div ref="loadMore" class="load-more">~~</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AlbaService from '@/services/AlbaService.js'
import AlbumCard from '@/components/AlbumCard.vue'

const alba = ref([])
const page = ref(1)
const perPage = ref(10)
let isFetching = false

onMounted(() => {
  const albumList = document.querySelector('.alba')
  const loadMore = document.querySelector('.load-more')

  function fetchAlba() {
  isFetching = true
  AlbaService.getAlba(page.value, perPage.value)
    .then(albums => {
      alba.value = [...alba.value, ...albums]
      page.value++
      isFetching = false
    })
    .catch(error => {
      console.log(error)
      isFetching = false
    })
  }

function observeLoadMore() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  }
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !isFetching) {
      fetchAlba()
    }
  }, options)
  if (loadMore) {
    observer.observe(loadMore)
  }
}
  fetchAlba()
  observeLoadMore()
})
</script>

<style>
#app {
  width: 80%;
  margin: 0 auto;
}
.alba {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
}
.load-more {
  min-height: 1px;
  background-color: transparent;
  clear: both;
display: block;
width: 100%;
}
</style>