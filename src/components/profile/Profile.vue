<template>
  <div>
    <va-card title="Update Profile">
      <div>
        <form @submit.prevent="updateUser()">
          <va-input
            v-model="user_name"
            type="text"
            label="User Name"
            placeholder="Enter User Name"
            :disabled="true"
          />
          <va-input
            v-model="email"
            type="email"
            label="Email"
            :disabled="true"
          />
          <va-input
            v-model="password"
            type="password"
            label="Password"
            pattern="[A-Za-z0-9_@!./#&+-^]{8,}$"
            placeholder="Enter Password"
          />
          <va-input
            v-model="phone_number"
            type="text"
            label="Phone Number"
            pattern="[6-9]{1}[0-9]{9}"
            maxlength="10"
            placeholder="Enter Phone Number"
            required="true"
          />
          <div class="d-flex justify--center mt-3">
            <va-button type="submit" class="my-0">Update</va-button>
          </div>
        </form>
      </div>
    </va-card>
  </div>
</template>

<script>
import Vue from 'vue'
import vueResource from 'vue-resource'
import config from '../../i18n/en.json'
Vue.use(vueResource)

export default {
  name: 'profile',
  beforeCreate () {
    const loader = Vue.$loading.show({ width: 40, height: 40 })
    this.$http.get(config.menu.host + 'api/user/' + this.$cookies.get('user-id')).then(response => {
      loader.hide()
      var userProfile = response.body
      this.user_name = userProfile.user_name
      this.email = userProfile.email
      this.password = ''
      this.phone_number = userProfile.phone_number
      this.user_id = userProfile.user_id
    }, error => {
      if (error && error.body) {
        Vue.notify({
          text: error.body,
          type: 'error',
        })
      }
      this.getAllUser()
      loader.hide()
    })
  },
  data () {
    return {
      user_name: '',
      email: '',
      password: '',
      phone_number: '',
      userNameErrors: [],
      emailErrors: [],
      passwordErrors: [],
      phoneNumberErrors: [],
    }
  },
  computed: {
    checkpassword () {
      if (this.password.length === 0) {
        console.log('this.password.length equal', this.password.length)
        return true
      } else if (this.password.length >= 8) {
        console.log('this.password.length 8', this.password.length)
        return true
      } else {
        console.log('this.password.length false', this.password.length)
        return false
      }
    },

  },
  methods: {
    getAllUser () {
      const loader = Vue.$loading.show({ width: 40, height: 40 })
      this.$http.get(config.menu.host + 'api/user/' + this.$cookies.get('user-id')).then(response => {
        loader.hide()
        var userProfile = response.body
        this.user_name = userProfile.user_name
        this.email = userProfile.email
        this.password = ''
        this.phone_number = userProfile.phone_number
        this.user_id = userProfile.user_id
      }, error => {
        loader.hide()
        if (error && error.body) {
          Vue.notify({
            text: error.body,
            type: 'error',
          })
        }
      })
    },
    updateUser () {
      var payload = {
        user_name: this.user_name,
        last_name: this.last_name,
        email: this.email,
        phone_number: this.phone_number,
      }
      if (this.password) {
        payload.password = this.password
      }
      const loader = Vue.$loading.show({ width: 40, height: 40 })
      this.$http.put(config.menu.host + 'api/user/' + this.user_id, payload).then(response => {
        loader.hide()
        if (response && response.body) {
          Vue.notify({
            text: response.body,
            type: 'success',
          })
        }
        this.getAllUser()
      }, error => {
        loader.hide()
        if (error && error.body) {
          Vue.notify({
            text: error.body,
            type: 'error',
          })
        }
      })
    },
  },
}
</script>

<style lang="scss">
</style>
