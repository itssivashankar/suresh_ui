import Vue from 'vue'
import Router from 'vue-router'
import AuthLayout from '../components/auth/AuthLayout'
import AppLayout from '../components/admin/AppLayout'
import Login from '../components/auth/login/Login.vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(Router)
Vue.use(require('vue-cookies'))

const EmptyParentComponent = {
  template: '<router-view></router-view>',
}

function loginAuthGuard (to, from, next) {
  var accessToken = Vue.$cookies.get('x-access-token')
  if (accessToken) {
    Vue.$cookies.remove('x-access-token')
    Vue.$cookies.remove('user-id')
  }
  var isAuthenticated = localStorage.getItem('LoggedInUser')
  console.log('isAuthenticated', isAuthenticated)
  if (to.meta.isLoggedInCheck) {
    if (isAuthenticated) {
      next('/')
      return
    }
  }

  next()
}

export default new Router({
  // mode: process.env.VUE_APP_ROUTER_MODE_HISTORY === 'true' ? 'history' : 'hash',
  routes: [{
    path: '*',
    redirect: { name: 'login' },
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [{
      name: 'login',
      path: 'login',
      meta: {
        isLoggedInCheck: true,
      },
      beforeEnter: loginAuthGuard,
      component: Login,
    },
    {
      name: 'signup',
      path: 'signup',
      meta: {
        isLoggedInCheck: true,
      },
      beforeEnter: loginAuthGuard,
      component: () =>
        import('../components/auth/signup/Signup.vue'),
    },
    {
      name: 'recover-password',
      path: 'recover-password',
      meta: {
        isLoggedInCheck: true,
      },
      beforeEnter: loginAuthGuard,
      component: () =>
        import('../components/auth/recover-password/RecoverPassword.vue'),
    },
    {
      path: '',
      redirect: { name: 'login' },
    },
    ],
  },
  {
    path: '/404',
    component: EmptyParentComponent,
    children: [],
  },
  {
    name: 'Admin',
    path: '/admin',
    component: AppLayout,
    children: [{
      name: 'dashboard',
      path: 'dashboard',
      component: () =>
        import('../components/dashboard/Dashboard.vue'),
      default: true,
    },
    {
      name: 'workers',
      path: 'workers',
      component: () =>
        import('../components/workers/Workers.vue'),
      children: [],
    },
    {
      name: 'profile',
      path: 'profile',
      component: () =>
        import('../components/profile/Profile.vue'),
      children: [],
    },
    {
      name: 'workinfo',
      path: 'workinfo',
      component: () =>
        import('../components/workinfo/Workinfo.vue'),
      children: [],
    },
    
    // {
    //   name: 'operatordetails',
    //   path: 'operatordetails',
    //   component: () =>
    //     import('../operator/OperatorDetails.vue'),
    //   children: [],
    // },
    // {
    //   name: 'upgrade',
    //   path: 'upgrade',
    //   component: () => import('../components/upgrade/Upgrade.vue'),
    //   children: [],
    // },
    ],
  },
  ],
})
