import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Artist from '@/views/ArtistView.vue'
import Genre from '@/views/GenreView.vue'
import Label from '@/views/LabelView.vue'

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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LabelView.vue')
    },
    {
      path: '/label/:name',
      name: 'Label',
      component: Label
    }

  ]
})

export default router