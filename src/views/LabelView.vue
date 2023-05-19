<template>
  <div class="alba" ref="albumList">
        <div class="intro-card artist">
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
    const { name } = this.$route.params;
    const data = await AlbaService.getAlbumsByLabel(name);
    this.label = data.label.name;
    this.description = data.label.description;  // This line is to get the description of the label.
    this.alba = data.alba;
  }
}
</script>