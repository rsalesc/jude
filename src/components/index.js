import Vue from 'vue';
import VuePaginate from 'vue-paginate';
import MainPage from './main.vue';
//import VueMaterialComponents from 'vue-material-components';]
import 'highlight.js/styles/agate.css';


Vue.use(VuePaginate);
//Vue.use(VueMaterialComponents);

new Vue({
    el: 'body',
    components: {JuMain: MainPage}
});