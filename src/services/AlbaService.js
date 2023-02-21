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
                const genreIds = album.genre
                const genrePromises = genreIds.map(id => {
                    return apiClient.get(`/genre/${id}`).then(response => {
                        return response.data.name
                    })
                })
                const artistId = album.artist
                const artistPromise = apiClient.get(`/artist/${artistId}`).then(response => {
                    return response.data.name
                })
                const yearId = album.jaren
                const yearPromise = apiClient.get(`/jaren/${yearId}`).then(response => {
                    return response.data.name
                })
                return Promise.all([Promise.all(genrePromises), artistPromise, yearPromise]).then(([genres, artist, jaren]) => {
                    album.genres = genres
                    album.jaren = jaren
                    album.artist = artist
                    return album
                })
            })
        return Promise.all(albumPromises)
        })
    }
}

//https://www.demaandagavond.nl/wp-json/wp/v2/genre/471