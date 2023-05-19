import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://www.demaandagavond.nl/wp-json/wp/v2/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
  getAlba(page = 1, perPage = 15) {
      return apiClient.get('/dma_alba', {
          params: {
            page: page,
            per_page: perPage
          }
      }).then(response => {
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
      return Promise.all(albumPromises)
      })
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
  getAlbumsByArtist(artistName) {
    return apiClient.get('/artist', {
      params: {
        search: artistName,
        per_page: 1,
      },
    }).then((response) => {
      const artist = response.data[0];
      if (!artist) {
        throw new Error(`No artist found with name "${artistName}"`);
      }

      return apiClient
        .get('/dma_alba', {
          params: {
            artist: artist.id,
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
              artist: {
                name: artist.name,
                description: artist.description,
              },
              alba: alba,
            }
          });
        });
    });
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