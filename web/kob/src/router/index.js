import NotFoundView from '@/views/NotFoundView.vue'
import PkIndexView from '@/views/PkIndexView.vue'
import RanklistIndexView from '@/views/RanklistIndexView.vue'
import RecordIndexView from '@/views/RecordIndexView.vue'
import UserProfileView from '@/views/user/UserProfileView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'pk',
    component: PkIndexView
  },
  {
    path: '/ranklist/',
    name: 'ranklist',
    component: RanklistIndexView
  },
  {
    path: '/record/',
    name: 'record',
    component: RecordIndexView
  },
  {
    path: '/userprofile/',
    name: 'userprofile',
    component: UserProfileView
  },
  {
    path: '/404/',
    name: '404',
    component: NotFoundView
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404/'
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
