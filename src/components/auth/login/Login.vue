<template>
  <form @submit.prevent="onsubmit">
    <va-input
      v-model="email"
      type="email"
      label="Email"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
    />

    <va-input
      v-model="password"
      type="password"
      label="Password"
      pattern="[A-Za-z0-9_@!./#&+-^]{8,}$"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />
    <div v-if="err_flag" style="color: Tomato;"><label>{{err_msg}}</label></div>
    <div class="d-flex justify--center mt-3">
      <va-button type="submit" class="my-0">Login</va-button>
    </div>
  </form>
</template>

<script>
import config from '../../../i18n/en'
import Vue from 'vue'
import vueResource from 'vue-resource'
import { navigationRoutes } from '../../admin/app-sidebar/NavigationRoutes'
// console.log(navigationRoutes)

Vue.use(vueResource)
export default {
  name: 'login',
  created () {
    this.$themes.primary = '#2c82e0'
    this.$themes.info = '#2c82e0'
  },
  data () {
    return {
      email: '',
      password: '',
      keepLoggedIn: false,
      emailErrors: [],
      passwordErrors: [],
      err_flag: false,
      err_msg: '',
    }
  },
  computed: {
    formReady () {
      return !this.emailErrors.length && !this.passwordErrors.length
    },
  },
  methods: {
    onsubmit () {
      this.emailErrors = this.email ? [] : ['Email is required']
      this.passwordErrors = this.password ? [] : ['Password is required']
      if (!this.formReady) {
        return
      }
      this.$http.post(config.menu.host + 'api/user/login', { email: this.email, password: this.password }).then(data => {
        var response = data.body
        Vue.$cookies.set('x-access-token', response.token)
        Vue.$cookies.set('user-id', response.userId)
        Vue.$cookies.set('userRole', response.role)
        var navigation_routes = navigationRoutes.routes
        var user_role = response.role
        var routes_data_by_role = []
        for (var i = 0; i < navigation_routes.length; i++) {
          if (navigation_routes[i].meta.authorize.includes(user_role)) {
            routes_data_by_role.push(navigation_routes[i])
          }
        }
        navigationRoutes.routes = routes_data_by_role

        this.$router.push({ name: 'dashboard' })
      }, err => {
        console.log('Error in login', err)
        this.err_flag = true
        this.err_msg = 'Invalid login credentials'
      })
    },
  },
}
</script>

<style lang="scss">
</style>
