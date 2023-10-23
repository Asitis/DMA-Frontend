<template>
    <div class="alba" ref="albumList">
        <div class="intro-card home">
            <h1>Music<br />Tasting<br />Notes</h1>
            <h3>Is what these are.</h3>
            <p>
                Here I keep notes on 'all' the albums I listen, as a personal
                reference to remember me about all the awesome music out there.
                Most notes will be very positive, because I don't tend to listen
                to music I don't like.
            </p>
            <p>
                The site is called 'De Maandagavond' (The Mondayevening) and is
                a remnant of old days of yore, when I would meet up with friends
                every monday evening to mostly discuss music. That hobby shortly
                evolved to a local and online radioshow on this domain, and
                after that crashed and burned, I kept it alive, still dedicated
                to the music.
            </p>
        </div>
        <AlbumCard v-for="album in alba" :key="album.id" :album="album" />
        <div ref="loadMore" class="load-more">
            Loading
            <div class="loadingio-spinner-disk-v6bdvx4mffa">
                <div class="spinnerLoader">
                    <div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AlbaService from '@/services/AlbaService.js';
import AlbumCard from '@/components/AlbumCard.vue';

const alba = ref([]);
const page = ref(1);
const perPage = ref(30);
let isFetching = false;

onMounted(() => {
    const albumList = document.querySelector('.alba');
    const loadMore = document.querySelector('.load-more');

    function fetchAlba() {
        isFetching = true;
        AlbaService.getAlba(page.value, perPage.value)
            .then((albums) => {
                alba.value = [...alba.value, ...albums];
                page.value++;
                isFetching = false;
            })
            .catch((error) => {
                console.log(error);
                isFetching = false;
            });
    }

    function observeLoadMore() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        };
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isFetching) {
                fetchAlba();
            }
        }, options);
        if (loadMore) {
            observer.observe(loadMore);
        }
    }
    fetchAlba();
    observeLoadMore();
});
</script>

<style>
#app {
    width: 85%;
    margin: 50px auto 220px;
}
.alba {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
}
.load-more {
    min-height: 1px;
    background-color: #28292b;
    margin: 5px;
    padding: 20px;
    color: #fff;
}
@keyframes spinnerLoader {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.spinnerLoader > div > div {
    position: absolute;
    border-radius: 50%;
}
.spinnerLoader > div > div:nth-child(1) {
    top: 15px;
    left: 15px;
    width: 70px;
    height: 70px;
    background: #000000;
}
.spinnerLoader > div > div:nth-child(2) {
    top: 19.900000000000002px;
    left: 39.5px;
    width: 21px;
    height: 21px;
    background: #ffa600;
    animation: spinnerLoader 1s linear infinite;
    transform-origin: 10.5px 30.099999999999998px;
}
.loadingio-spinner-disk-v6bdvx4mffa {
    width: 61px;
    height: 61px;
    display: block;
    overflow: hidden;
    background: #28292b;
}
.spinnerLoader {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(0.61);
    backface-visibility: hidden;
    transform-origin: 0 0; /* see note above */
}
.spinnerLoader div {
    box-sizing: content-box;
}
@media (max-width: 1020px) {
    #app {
        width: 90%;
    }
}
@media (min-width: 2000px) {
    #app {
        width: 98%;
    }
}
</style>