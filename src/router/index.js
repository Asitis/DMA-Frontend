import { createRouter, createWebHistory } from 'vue-router'
import { eventBus } from '@/utils/EventBus.js'
import HomeView from '@/views/HomeView.vue'
import Artist from '@/views/ArtistView.vue'
import Genre from '@/views/GenreView.vue'
import Label from '@/views/LabelView.vue'
import Year from '@/views/YearView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/artist',
            name: 'artist',
            component: () => import('../views/ArtistView.vue')
        },
        {
            path: '/artist/:name',
            name: 'Artist',
            component: Artist
        },
        {
            path: '/genre',
            name: 'genre',
            component: () => import('../views/GenreView.vue')
        },
        {
            path: '/genre/:name',
            name: 'Genre',
            component: Genre
        },
        {
            path: '/label',
            name: 'label',
            component: () => import('../views/LabelView.vue')
        },
        {
            path: '/label/:name',
            name: 'Label',
            component: Label
        },
        {
            path: '/year',
            name: 'year',
            component: () => import('../views/YearView.vue')
        },
        {
            path: '/year/:name',
            name: 'Year',
            component: Year
        }

    ]
});

// Set the page title based on the route
router.beforeEach((to, from, next) => {
    // Define a default title for your website
    const baseTitle = 'DeMaandagavond.nl';

    // Determine the route's title based on the route name and parameters
    let pageTitle = baseTitle;

    if (to.name === 'Artist') {
        // Set the title for the Artist route with the artist's name
        pageTitle = `${to.params.name} - ${baseTitle}`;
    } else if (to.name === 'Year') {
        // Set the title for the Year route with the year's name
        pageTitle = `${to.params.name} - ${baseTitle}`;
    } else if (to.name === 'Genre') {
        // Set the title for the Genre route with the genre's name
        pageTitle = `${to.params.name} - ${baseTitle}`;
    } else if (to.name === 'Label') {
        // Set the title for the Label route with the label's name
        pageTitle = `${to.params.name} - ${baseTitle}`;
    }

    // Update the page title
    document.title = pageTitle;

    // Continue with the route navigation
    next();
});

router.beforeEach((to, from, next) => {
    if (['Artist', 'Genre', 'Label', 'Year'].includes(to.name)) {
        eventBus.emit('clear-filters');
    }
    next();
});

export default router