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

                // Get Images
                const featuredImageId = album.featured_media
                const featuredImagePromise = featuredImageId
                  ? apiClient.get(`/media/${featuredImageId}`).then(response => {
                    return response.data.source_url
                  })
                  : Promise.resolve(null)
                return Promise.all([Promise.all(genrePromises), artistPromise, yearPromise, featuredImagePromise]).then(([genres, artist, jaren, featuredImageUrl]) => {
                    album.genres = genres
                    album.jaren = jaren
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

    getAlbumsByArtist(artistName) {
        return apiClient.get('/artist', {
          params: {
            search: artistName,
            per_page: 1,
          },
        }).then((response) => {
          const artistId = response.data[0]?.id;
          if (!artistId) {
            throw new Error(`No artist found with name "${artistName}"`);
          }
          return apiClient
            .get('/dma_alba', {
              params: {
                artist: artistId,
              },
            })
            .then((response) => {
              return response.data.map((album) => {
                return {
                  id: album.id,
                  title: album.title.rendered,
                  content: album.content.rendered,
                  imageUrl: album.featured_image_url,
                  jaren: album.jaren,
                  artist: album.artist,
                  genres: album.genres,
                };
              });
            });
        });
    }
}