// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import StartScreen from '../views/StartScreen.vue'
import PlayScreen from '../views/PlayScreen.vue'

const routes = [
  { path: '/', component: StartScreen },
  { path: '/play', component: PlayScreen }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router