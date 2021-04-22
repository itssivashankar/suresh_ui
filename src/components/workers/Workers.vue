<style>
.style-1 {
  background-color: black;
}

.style-2 {
  background-color: white;
}
</style>

<template>
  <div v-if="isshowgrid">
    <va-card title="Workers List">
      <template slot="actions">
        <va-button color="success" icon="fa fa-plus" @click="add()">Add</va-button>
      </template>
      <div class="row">
        <div class="flex xs12 md6">
          <va-input
            :value="term"
            placeholder="search"
            @input="search"
            removable
          >
            <va-icon name="fa fa-search" slot="prepend" />
          </va-input>
        </div>

      </div>
      <va-data-table
        :fields="fields"
        :data="filteredData"
        :per-page="parseInt(perPage)"
        clickable
      >
        <template slot="actions" slot-scope="props">
          <va-button flat small color="gray" icon="fa fa-pencil" @click="edit(props.rowData)" class="ma-0"></va-button>
        </template>
        <template slot="info" slot-scope="props">
          <va-button flat small color="gray" icon="fa fa-table" @click="redirect(props.rowData)" class="ma-0"></va-button>
        </template>
      </va-data-table>
    </va-card>
  </div>

  <div v-else-if='isshowForm'>
    <div>
      <va-card title="create Worker">
        <template slot="actions">
          <va-button color="gray" @click="list()">List</va-button>
        </template>
        <div>
          <form @submit.prevent="isCreate ?createUser():updateUser()">
            <va-input
              v-model="worker_name"
              type="text"
              label="worker Name *"
              pattern="^[A-Za-z]+$"
              :disabled="isUpdate?true:false"
              placeholder="Enter Worker Name"
              required="true"
            />
            <va-input
              v-model="phone_number"
              type="telphone"
              label="Mobile Number *"
              pattern="[6-9]{1}[0-9]{9}"
              maxlength="10"
              placeholder="Enter Mobile Number"
              required="true"
            />
            <div class="d-flex justify--center mt-3">
              <va-button type="submit" class="my-0" >{{isCreate ? 'Create':'Update'}}</va-button>
              <va-button type="submit" class="my-0" @click="list()">Cancel</va-button>
            </div>
          </form>
        </div>
      </va-card>
    </div>
  </div>
</template>

<script>

import { debounce } from 'lodash'
import Vue from 'vue'
import vueResource from 'vue-resource'
import { search } from '../../i18n/search.js'
import config from '../../i18n/en.json'
Vue.use(vueResource)

export default {
  name: 'workers',
  beforeCreate () {
    this.$http.get(config.menu.host + 'api/worker').then(response => {
      this.workers = (response.body.length > 0) ? response.body : []
      this.isshowForm = false
      this.isshowgrid = true
      // this.getAllUser()
    }, err => {
      console.log('User get call error', err)
    })
  },
  data () {
    return {
      term: null,
      perPage: '6',
      perPageOptions: ['4', '6', '10', '20'],
      workers: [],
      isshowgrid: false,
      isshowForm: false,
      isCreate: false,
      isUpdate: false,
      worker_name: '',
      status: true,
      phone_number: '',
    }
  },
  computed: {
    fields () {
      return [{
        name: '__slot:marker',
        width: '30px',
        dataClass: 'text-center',
      },
      {
        name: 'id',
        title: 'Worker ID',
      },
      {
        name: 'worker_name',
        title: 'Worker Name',
      },
      {
        name: '__slot:info',
        dataClass: 'text-right',
      },
      {
        name: '__slot:actions',
        dataClass: 'text-right',
      }]
    },
    filteredData () {
      var gridData = search(this.term, this.workers)
      var roleObject = {
        SYS_ADMIN: 'Sys Admin',
        MSO_ADMIN: 'Mso Admin',
      }
      if (gridData.length > 0) {
        gridData.map(function (item) {
          for (var key in roleObject) {
            if (item.role === key) {
              item.role = roleObject[key]
            }
          }
        })
      }
      return gridData
    },
  },
  methods: {
    getAllUser () {
      this.$http.get(config.menu.host + 'api/worker').then(response => {
        this.workers = (response.body.length > 0) ? response.body : []
      }, response => {
        console.log('USER ERR RESPONSE', response)
      })
    },
    createUser () {
      var payload = {
        worker_name: this.worker_name,
        phone_number: this.phone_number,
      }
      this.$http.post(config.menu.host + 'api/worker', payload).then(responseData => {
        if (responseData && responseData.body) {
          Vue.notify({
            text: responseData.body,
            type: 'success',
          })
        }
        this.list()
      }, errResponse => {
        if (errResponse && errResponse.body) {
          Vue.notify({
            text: errResponse.body,
            type: 'error',
          })
        }
        console.log('User Create ERR RESPONSE', errResponse)
      })
    },
    updateUser () {
      var payload = {
        worker_name: this.worker_name,
        phone_number: this.phone_number
      }
      this.$http.put(config.menu.host + 'api/worker/' + this.user_id, payload).then(responseData => {
        if (responseData && responseData.body) {
          Vue.notify({
            text: responseData.body,
            type: 'success',
          })
        }
        this.list()
      }, errResponse => {
        if (errResponse && errResponse.body) {
          Vue.notify({
            text: errResponse.body,
            type: 'error',
          })
        }
      })
    },
    edit (row) {
      this.worker_name = row.worker_name
      this.mall_given = row.mall_given
      this.mall_collected = row.mall_collected
      this.email = row.email
      this.mall_balance = row.mall_balance
      this.password = ''
      this.phone_number = row.phone_number
      this.status = row.status?true:false
      this.user_id = row.id
      this.role = row.role
      this.isshowgrid = false
      this.isshowForm = true
      this.isCreate = false
      this.isUpdate = true
    },
    redirect(row){
      Vue.prototype.$id = row.id;
      Vue.prototype.$worker_name = row.worker_name;
      this.$router.push({ name: 'workinfo' })
    },
    add () {
      this.worker_name = ''
      this.phone_number = ''
      this.isshowForm = true
      this.isshowgrid = false
      this.isUpdate = false
      this.isCreate = true
    },
    list () {
      this.getAllUser()
      this.isshowForm = false
      this.isshowgrid = true
    },
    search: function (term) {
      this.term = term
    },
  },
}
</script>