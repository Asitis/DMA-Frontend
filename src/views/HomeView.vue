<template>
  <div class="alba" ref="albumList">
    <div class="intro-card">
      <h1>Music<br>Tasting<br>Notes</h1>
      <h3>Is what these are.</h3>
      <p>Here I keep notes on 'all' the albums I listen, as a personal reference to remember me about all the awesome music out there. Most notes will be very positive, because I don't tend to listen to music I don't like.</p>
      <p>This is also my online playground to play around with data-sets like these, tinckering with the design, database and code of the website, continually improving it. This means this site gets a facelift like every other day. And shit might not work, don't tell me, I probably already know.</p>
      <p>The site is called 'De Maandagavond' (The Mondayevening) and is a remnant of old days of yore, when I would meet up with friends every monday evening to mostly discuss music. That hobby shortly evolved to a local and online radioshow on this domain, and after that crashed and burned, I kept it alive, still dedicated to the music.</p>
    </div>
    <AlbumCard v-for="album in alba" :key="album.id" :album="album" />
    <div ref="loadMore" class="load-more"></div>
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
}
</style>