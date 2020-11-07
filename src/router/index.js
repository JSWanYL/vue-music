import Vue from 'vue'
import VueRouter from 'vue-router'

//导入组件
import Recommend from 'components/recommend/recommend.vue';
import Singer from 'components/singer/singer.vue';
import Rank from 'components/rank/rank.vue';
import Search from 'components/search/search.vue';
import SingerDetail from 'components/singer-detail/singer-detail.vue';
import Disc from 'components/disc/disc.vue';
import TopList from 'components/top-list/top-list.vue';


Vue.use(VueRouter)

  const routes = [
  {path: '/', redirect: '/recommend'},
  {path: '/recommend', component: Recommend, children: [
  	{path: ':id', component: Disc}
  ]},
  {path: '/singer', component: Singer, children: [
  	{path: ':id', component: SingerDetail}
  ]},
  {path: '/rank', component: Rank, children: [
    {path: ':id', component: TopList}
  ]},
  {path: '/search', component: Search, children: [
    {path: ':id', component: SingerDetail}
  ]}
]

const router = new VueRouter({
  routes
})

export default router
