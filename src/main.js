import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueLazyLoad from 'vue-lazyload';

//安装lazyload
Vue.use(VueLazyLoad, {
  preLoad: 1,
  loading: require('common/image/default.png'),
  attempt: 2
});

Vue.config.productionTip = false;

import 'common/stylus/index.styl';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
