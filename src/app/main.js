// Polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { ColorThemePlugin } from '../services/vuestic-ui'
import store from '../store/index'
import router from '../router/index'
import { VuesticPlugin } from '../services/vuestic-ui/components'
import '../i18n/index'
// Vue.use(require('vue-resource'));
import VueResource from 'vue-resource'
import Notifications from 'vue-notification'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
// import ParentInterface from '../components/interface/ParentInterface.vue'
// import { navigationRoutes } from './../components/admin/app-sidebar/NavigationRoutes'
// import Interface from '../components/interface/Interface.vue'

Vue.use(Loading)
Vue.use(Notifications)
Vue.use(VueResource)

Vue.use(VuesticPlugin)
// import VueNotifications from 'vue-notifications'
// import VueToasted from 'vue-toasted' // https://github.com/shakee93/vue-toasted

// function toast({ title, message, type, timeout, cb }) {
//   console.log("title, message, type, timeout, cb",title, message, type, timeout, cb)
//   if (type === VueNotifications.types.warn) type = 'show'
//   return Vue.toasted[type](message, { duration: timeout })
// }

// Vue.use(VueToasted)

// const options = {
//   success: toast,
//   error: toast,
//   info: toast,
//   warn: toast
// }
// Vue.use(VueNotifications, options)
// console.log("test....")
// var childForRoutes=[],childForNavigation=[]
// function getInterfaceList(){
//   Vue.http.get('http://localhost:8020/api/network-setting/interface/name').then(response => {
//           console.log("response for parent Main",response)
//           var response=[{name:'enp1s0'},{name:'eth0'}]
//           for (var i = 0; i < response.length; i++) {
//             var obj = response[i];
//             childForRoutes.push({name:obj.name,path:obj.name,component:Interface})
//             childForNavigation.push({name:obj.name,displayName:obj.name})
//           }

//           // var response=[{name:'enp1s0'},{name:'eth0'}]
//           // for (var i = 0; i < response.length; i++) {
//           //   var obj = response[i];
//           //   childForRoutes.push({name:obj.name,path:obj.name,component:Interface})
//           //   childForNavigation.push({name:obj.name,displayName:obj.name})
//           // }
//           // navigationRoutes.routes[1].children = childForNavigation;
//   }, response => {
//     console.log('ENTER TO LOGIN USER ERR RESPONSE', response)
//   })
// }

// getInterfaceList()

Vue.use(ColorThemePlugin, {
  // override colors here.
  primary: '#6c7fee',
  secondary: '#6e7ff1',
  success: '#8ddc88',
  info: '#71baff',
  danger: '#f8706d',
  warning: '#ffd652',
  gray: '#8396a5',
  dark: '#34495e',
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

Vue.http.interceptors.push(function (request) {
  // console.log('request in interceptors', request)
  var accessToken = Vue.$cookies.get('x-access-token')
  // console.log('accessToken in request', accessToken)
  // ParentInterface.methods.test();
  request.headers.set('x-access-token', accessToken)
  // var host
  // if (store.getters.config.isProduction) {
  //   host = store.getters.config.production
  // } else {
  //   host = store.getters.config.dev
  // }
}, response => {
  // Response handling
})
