import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://www.demaandagavond.nl/wp-json/wp/v2/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});
// apiClient.interceptors.request.use((config) => {
//   console.log(`Axios is calling URL: ${config.baseURL}${config.url} with parameters:`, config.params);
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// Helper function to retrieve additional album data
async function fetchAlbumData(album, endpoint) {
  const id = album[endpoint];
  if (Array.isArray(id)) {
    const promises = id.map((itemId) =>
      apiClient.get(`/${endpoint}/${itemId}`).then((response) => response.data.name)
    );
    return Promise.all(promises);
  } else {
     return apiClient.get(`/${endpoint}/${id}`).then((response) => response.data.name);
  }
}

export default {
  async getAlba(page = 1, perPage = 15) {
    const response = await apiClient.get('/dma_alba', {
      params: {
        page: page,
        per_page: perPage,
      },
    });

    const albumPromises = response.data.map(async (album) => {
      const [genres, artist, jaren, labels, featuredImageUrl] = await Promise.all([
        fetchAlbumData(album, 'genre'),
        fetchAlbumData(album, 'artist'),
        fetchAlbumData(album, 'jaren'),
        fetchAlbumData(album, 'labels'),
        album.featured_media
          ? apiClient.get(`/media/${album.featured_media}`).then((response) => response.data.source_url)
          : null,
      ]);

      album.genres = genres;
      album.jaren = jaren;
      album.labels = labels;
      album.artist = artist;
      album.featuredImageUrl = featuredImageUrl;

      return album;
    });

    return Promise.all(albumPromises);
  },

  getArtists() {
      return apiClient.get('/artist', {
          params: {
              per_page: 100 // Limit the number of results to 100
          }
      }).then(response => {
          return response.data.map(artist => artist.name)
      })
  },
  getGenres() {
    return apiClient.get('/genre', {
        params: {
            per_page: 100 // Limit the number of results to 100
        }
    }).then(response => {
        return response.data.map(genre => genre.name)
    })
  },
  getLabels() {
    return apiClient.get('/labels', {
        params: {
            per_page: 100 // Limit the number of results to 100
        }
    }).then(response => {
        return response.data.map(label => label.name)
    })
  },
  async getAlbumsByArtist(artistName) {
    const artistResponse = await apiClient.get('/artist', {
      params: {
        search: artistName,
        per_page: 1,
      },
    });

    const artist = artistResponse.data[0];
    if (!artist) {
      throw new Error(`No artist found with name "${artistName}"`);
    }

    const albumsResponse = await apiClient.get('/dma_alba', {
      params: {
        artist: artist.id,
      },
    });

    const albumPromises = albumsResponse.data.map(async (album) => {
      const [genres, artist, jaren, labels, featuredImageUrl] = await Promise.all([
        fetchAlbumData(album, 'genre'),
        fetchAlbumData(album, 'artist'),
        fetchAlbumData(album, 'jaren'),
        fetchAlbumData(album, 'labels'),
        album.featured_media
          ? apiClient.get(`/media/${album.featured_media}`).then((response) => response.data.source_url)
          : null,
      ]);

      album.genres = genres;
      album.jaren = jaren;
      album.labels = labels;
      album.artist = artist;
      album.featuredImageUrl = featuredImageUrl;

      return album;
    });

    const alba = await Promise.all(albumPromises);

    return {
      artist: {
        name: artist.name,
        description: artist.description,
      },
      alba: alba,
    };
  },
  async getAlbumsByGenre(genreName) {
    const genreResponse = await apiClient.get('/genre', {
      params: {
          search: genreName,
          per_page: 1,
        },
      });
  
      const genre = genreResponse.data[0];
      if (!genre) {
        throw new Error(`No genre found with name "${genreName}"`);
      }
  
      const albumsResponse = await apiClient.get('/dma_alba', {
        params: {
          genre: genre.id,
        },
      });
  
      const albumPromises = albumsResponse.data.map(async (album) => {
        const [genres, artist, jaren, labels, featuredImageUrl] = await Promise.all([
          fetchAlbumData(album, 'genre'),
          fetchAlbumData(album, 'artist'),
          fetchAlbumData(album, 'jaren'),
          fetchAlbumData(album, 'labels'),
          album.featured_media
            ? apiClient.get(`/media/${album.featured_media}`).then((response) => response.data.source_url)
            : null,
        ]);
  
        album.genres = genres;
        album.jaren = jaren;
        album.labels = labels;
        album.artist = artist;
        album.featuredImageUrl = featuredImageUrl;
  
        return album;
      });
  
      const alba = await Promise.all(albumPromises);
  
      return {
        genre: {
          name: genre.name,
          description: genre.description,
        },
        alba: alba,
      };
  },
  async getAlbumsByLabel(labelName) {
    const labelResponse = await apiClient.get('/labels', {
        params: {
            search: labelName,
            per_page: 1,
      },
    });
    
    const label = labelResponse.data[0];
    if (!label) {
        throw new Error(`No label found with name "${labelName}"`);
      }

      const albumsResponse = await apiClient.get('/dma_alba', {
        params: {
          labels: label.id,
        },
      });
  
      const albumPromises = albumsResponse.data.map(async (album) => {
        const [genres, artist, jaren, labels, featuredImageUrl] = await Promise.all([
          fetchAlbumData(album, 'genre'),
          fetchAlbumData(album, 'artist'),
          fetchAlbumData(album, 'jaren'),
          fetchAlbumData(album, 'labels'),
          album.featured_media
            ? apiClient.get(`/media/${album.featured_media}`).then((response) => response.data.source_url)
            : null,
        ]);
  
        album.genres = genres;
        album.jaren = jaren;
        album.labels = labels;
        album.artist = artist;
        album.featuredImageUrl = featuredImageUrl;
  
        return album;
      });
  
      const alba = await Promise.all(albumPromises);
  
      return {
        label: {
          name: label.name,
          description: label.description,
        },
        alba: alba,
      };
  },
}