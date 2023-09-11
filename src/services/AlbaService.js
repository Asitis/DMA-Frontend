import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://www.demaandagavond.nl/wp-json/wp/v2/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

// Helper function to retrieve additional album data
async function fetchAlbumData(album, endpoint) {
  const id = album[endpoint];
  if (Array.isArray(id)) {
    // This worked for single outputs but breaks lazyloading of more content
    // const promises = id.map((itemId) =>
    // apiClient.get(`/${endpoint}/${itemId}`).then((response) => response.data.name)
    // );
    // if (id.length === 1) {
    //   const response = await apiClient.get(`/${endpoint}/${id[0]}`);
    //   return response.data.name;
    // } else {
    //   return Promise.all(promises);
    // }
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
  getAlbumsByGenre(genreName) {
    return apiClient.get('/genre', {
      params: {
        search: genreName,
        per_page: 1,
      },
    }).then((response) => {
      const genre = response.data[0];
      if (!genre) {
        throw new Error(`No genre found with name "${genreName}"`);
      }

      return apiClient
        .get('/dma_alba', {
          params: {
            genre: genre.id,
          },
        })
        .then((response) => {
          const albumPromises = response.data.map(album => {
            // Get Genres
            const genreIds = album.genre
            const genrePromises = genreIds.map(id => {
              return apiClient.get(`/genre/${id}`).then(response => {
                const genreName = response.data.name;
                const div = document.createElement('div');
                div.innerHTML = genreName;
                return div.textContent;
              });
            });

            // Get Artists
            const artistId = album.artist
            const artistPromise = Array.isArray(artistId)
                ? Promise.all(artistId.map(id => apiClient.get(`/artist/${id}`).then(response => {
                    const artistName = response.data.name;
                    const div = document.createElement('div');
                    div.innerHTML = artistName;
                    return div.textContent;
                })))
                .then(artistNames => artistNames.join(', '))
                : apiClient.get(`/artist/${artistId}`).then(response => {
                    const artistName = response.data.name;
                    const div = document.createElement('div');
                    div.innerHTML = artistName;
                    return div.textContent;
                });

            // Get Years
            const yearId = album.jaren
            const yearPromise = Array.isArray(yearId)
                ? Promise.all(yearId.map(id => apiClient.get(`/jaren/${id}`).then(response => response.data.name)))
                .then(yearNames => yearNames.join(', '))
                : apiClient.get(`/jaren/${yearId}`).then(response => response.data.name)

            // Get Labels
            const labelId = album.labels
            const labelPromise = Array.isArray(labelId)
                ? Promise.all(labelId.map(id => apiClient.get(`/labels/${id}`).then(response => response.data.name)))
                .then(labelNames => labelNames.join(', '))
                : apiClient.get(`/labels/${labelId}`).then(response => response.data.name)

            // Get Images
            const featuredImageId = album.featured_media
            const featuredImagePromise = featuredImageId
              ? apiClient.get(`/media/${featuredImageId}`).then(response => {
                return response.data.source_url
              })
              : Promise.resolve(null)
            return Promise.all([Promise.all(genrePromises), artistPromise, yearPromise, labelPromise, featuredImagePromise]).then(([genres, artist, jaren, labels, featuredImageUrl]) => {
                album.genres = genres
                album.jaren = jaren
                album.labels = labels
                album.artist = artist
                album.featuredImageUrl = featuredImageUrl
                return album
            })
          })
          return Promise.all(albumPromises).then(alba => {
            return {
              genre: {
                name: genre.name,
                description: genre.description,
              },
              alba: alba,
            }
          });
        });
    });
  },
  getAlbumsByLabel(labelName) {
    return apiClient.get('/labels', {
      params: {
        search: labelName,
        per_page: 1,
      },
    }).then((response) => {
      const label = response.data[0];
      if (!label) {
        throw new Error(`No label found with name "${labelName}"`);
      }

      return apiClient
        .get('/dma_alba', {
          params: {
            label: label.id,
          },
        })
        .then((response) => {
          const albumPromises = response.data.map(album => {
            // Get Genres
            const genreIds = album.genre
            const genrePromises = genreIds.map(id => {
              return apiClient.get(`/genre/${id}`).then(response => {
                const genreName = response.data.name;
                const div = document.createElement('div');
                div.innerHTML = genreName;
                return div.textContent;
              });
            });

            // Get Artists
            const artistId = album.artist
            const artistPromise = Array.isArray(artistId)
                ? Promise.all(artistId.map(id => apiClient.get(`/artist/${id}`).then(response => {
                    const artistName = response.data.name;
                    const div = document.createElement('div');
                    div.innerHTML = artistName;
                    return div.textContent;
                })))
                .then(artistNames => artistNames.join(', '))
                : apiClient.get(`/artist/${artistId}`).then(response => {
                    const artistName = response.data.name;
                    const div = document.createElement('div');
                    div.innerHTML = artistName;
                    return div.textContent;
                });

            // Get Years
            const yearId = album.jaren
            const yearPromise = Array.isArray(yearId)
                ? Promise.all(yearId.map(id => apiClient.get(`/jaren/${id}`).then(response => response.data.name)))
                .then(yearNames => yearNames.join(', '))
                : apiClient.get(`/jaren/${yearId}`).then(response => response.data.name)

            // Get Labels
            const labelId = album.labels
            const labelPromise = Array.isArray(labelId)
                ? Promise.all(labelId.map(id => apiClient.get(`/labels/${id}`).then(response => response.data.name)))
                .then(labelNames => labelNames.join(', '))
                : apiClient.get(`/labels/${labelId}`).then(response => response.data.name)

            // Get Images
            const featuredImageId = album.featured_media
            const featuredImagePromise = featuredImageId
              ? apiClient.get(`/media/${featuredImageId}`).then(response => {
                return response.data.source_url
              })
              : Promise.resolve(null)
            return Promise.all([Promise.all(genrePromises), artistPromise, yearPromise, labelPromise, featuredImagePromise]).then(([genres, artist, jaren, labels, featuredImageUrl]) => {
                album.genres = genres
                album.jaren = jaren
                album.labels = labels
                album.artist = artist
                album.featuredImageUrl = featuredImageUrl
                return album
            })
          })
          return Promise.all(albumPromises).then(alba => {
            return {
              label: {
                name: label.name,
                description: label.description,
              },
              alba: alba,
            }
          });
        });
    });
  }
}