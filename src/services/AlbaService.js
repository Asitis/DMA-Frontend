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
        return apiClient.get('/dma_alba');
    },
    getGenres() {
        return apiClient.get('/genre');
    }
}