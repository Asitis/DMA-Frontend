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
    getAlba() {
        return apiClient.get('/dma_alba').then(response => {
            const albumPromises = response.data.map(album => {
                // Get Genres
                const genreIds = album.genre
                const genrePromises = genreIds.map(id => {
                    return apiClient.get(`/genre/${id}`).then(response => {
                        return response.data.name
                    })
                })

                // Get Artists
                const artistId = album.artist
                const artistPromise = apiClient.get(`/artist/${artistId}`).then(response => {
                    return response.data.name
                })

                // Get Years
                const yearId = album.jaren
                const yearPromise = apiClient.get(`/jaren/${yearId}`).then(response => {
                    return response.data.name
                })

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
    }
}

//https://www.demaandagavond.nl/wp-json/wp/v2/genre/471