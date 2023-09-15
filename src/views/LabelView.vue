<template>
  <div class="alba" ref="albumList">
    <div class="intro-card label">
      <RouterLink to="/" class="backBtn">&laquo;</RouterLink>
      <h1>{{ label }}</h1>
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
      label: null,
      description: null,
      alba: []
    }
  },
  async created() {
    await this.fetchLabelData();
  },
  watch: {
    '$route.params.name': 'fetchLabelData'
  },
  methods: {
    async fetchLabelData() {
      const { name } = this.$route.params;
      const data = await AlbaService.getAlbumsByLabel(name);
      this.label = data.label.name;
      this.description = data.label.description;
      this.alba = data.alba;
    }
  }
}
</script>