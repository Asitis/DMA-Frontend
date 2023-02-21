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
            return Promise.all(genrePromises).then(genres => {
                album.genres = genres
                return album
            })
        })
        console.log(albumPromises)
        return Promise.all(albumPromises)
        })
    },
    getGenres(id) {
        return apiClient.get('/genre/' + id);
    },
}

//https://www.demaandagavond.nl/wp-json/wp/v2/genre/471