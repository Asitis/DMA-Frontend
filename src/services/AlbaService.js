import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://www.demaandagavond.nl/wp-json/wp/v2/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

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

let cachedGenre = null; // Cache the genre info here

export default {
    async getAlba(page = 1, perPage = 30) {
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
                per_page: 10,
            },
        });

        const artists = artistResponse.data;
        if (!artists.length) {
            throw new Error(`No artist found with name "${artistName}"`);
        }

        let artist = artists.find(a => a.name.toLowerCase() === artistName.toLowerCase());
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
    async getAlbumsByGenre(genreName, page = 1, perPage = 30) {
        if (!cachedGenre || page === 1) {
            const genreResponse = await apiClient.get('/genre', {
                params: {
                    search: genreName,
                    page: page,
                    per_page: perPage,
                },
            });
            if (!genreResponse.data.length) { throw new Error(`No genre found with name "${genreName}"`); }

            cachedGenre = genreResponse.data.find(g => g.name.toLowerCase() === genreName.toLowerCase());
            if (!cachedGenre) { throw new Error(`No genre found with name "${genreName}"`); }
        }

        const albumsResponse = await apiClient.get('dma_alba', {
            params: {
                genre: cachedGenre.id,
                page: page,
                per_page: perPage
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
        const artist = alba.length > 0 ? alba[0].artist : { name: '', count: 0, description: '' };
    
        return {
            genre: {
                name: cachedGenre.name,
                count: cachedGenre.count,
                description: cachedGenre.description,
            },    
            artist: {
                name: artist.name,
                count: artist.count,
                description: artist.description,
            },
            alba: alba,
        };
    },
    async getAlbumsByLabel(labelName) {
        const labelResponse = await apiClient.get('/labels', {
            params: {
                search: labelName,
                per_page: 10,
            },
        });

        const labels = labelResponse.data;
        if (!labels.length) {
            throw new Error(`No label found with name "${labelName}"`);
        }

        let label = labels.find(a => a.name.toLowerCase() === labelName.toLowerCase());
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