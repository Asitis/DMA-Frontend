<template>
  <div class="alba" ref="albumList">
    <div class="intro-card year">
      <h1>{{ year }}</h1>
      <p>{{ description }}</p>
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
      year: null,
      description: null,
      alba: []
    };
  },
  async created() {
    await this.fetchYearData();
  },
  watch: {
    '$route.params.name': 'fetchYearData'
  },
  methods: {
    async fetchYearData() {
      const { name } = this.$route.params;
      const data = await AlbaService.getAlbumsByYear(name);
      this.year = data.year.name;
      this.description = data.year.description; 
      this.alba = data.alba;
    }
  }
}
</script>