<template>
  <va-card>
    <center><h1>Welcome To NS Traders</h1></center>
  </va-card>
</template>

<script>
import Vue from 'vue'
import vueResource from 'vue-resource'

Vue.use(vueResource)
export default {
  name: 'dashboard',
  components: {

  },
  methods: {
  },
}
</script>

<script>
export default {
  name: 'dashboard',
  methods: {
    beforeCreate(){
    console.log('Cookies dashbored', this.$cookies.get('x-access-token'))
    }
  },
  components: {

  },
}
</script>
