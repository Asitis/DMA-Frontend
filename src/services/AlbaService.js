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

  async getArtists() {
    let allArtists = [];
    let currentPage = 1;
    try {
      let hasMore = false;
      do {
        const response = await apiClient.get('/artist', {
          params: {
            per_page: 100,
            page: currentPage,
          },
        });
        allArtists = [...allArtists, ...response.data.map(artist => {
          return {
            name: artist.name,
            count: artist.count,
          };
        })];
        hasMore = response.data.length === 100;
        currentPage++;
      } while (hasMore);
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return allArtists;
  },
  async getGenres() {
    let allGenres = [];
    let currentPage = 1;

    try {
      let hasMore = false;
      do {
        const response = await apiClient.get('/genre', {
          params: {
            per_page: 100,
            page: currentPage,
          },
        });
        allGenres = [...allGenres, ...response.data.map(genre => {
          return {
            name: genre.name,
            count: genre.count,
          };
        })];
        hasMore = response.data.length === 100;
        currentPage++;
      } while (hasMore);
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return allGenres;
  },
  async getLabels() {
    let allLabels = [];
    let currentPage = 1;

    try {
      let hasMore = false;
      do {
        const response = await apiClient.get('/labels', {
          params: {
            per_page: 100,
            page: currentPage,
          },
        });
        allLabels = [...allLabels, ...response.data.map(label => {
          return {
            name: label.name,
            count: label.count,
          };
        })];
        hasMore = response.data.length === 100;
        currentPage++;
      } while (hasMore);
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return allLabels;
  },
  async getYears() {
    let allYears = [];
    let currentPage = 1;

    try {
      let hasMore = false;
      do {
        const response = await apiClient.get('/jaren', {
          params: {
            per_page: 100,
            page: currentPage,
          },
        });
        allYears = [...allYears, ...response.data.map(year => {
          return {
            name: year.name,
            count: year.count,
          };
        })];
        hasMore = response.data.length === 100;
        currentPage++;
      } while (hasMore);
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return allYears;
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
        count: artist.count,
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
          count: genre.count,
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
          count: label.count,
          description: label.description,
        },
        alba: alba,
      };
  },
  async getAlbumsByYear(yearName) {
    const yearResponse = await apiClient.get('/jaren', {
      params: {
          search: yearName,
          per_page: 1,
        },
      });
  
      const year = yearResponse.data[0];
      if (!year) {
        throw new Error(`No year found with name "${yearName}"`);
      }
  
      const albumsResponse = await apiClient.get('/dma_alba', {
        params: {
          jaren: year.id,
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
        year: {
          name: year.name,
          count: year.count,
          description: year.description,
        },
        alba: alba,
      };
  },
}