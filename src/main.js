import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'

import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

createApp(App)
  .use(Varlet)
  .use(Vue3Toastify, {
    autoClose: 3000,
    position: 'top-right',
    theme: 'dark',
  })
  .use(VueSweetalert2)
  .mount('#app')