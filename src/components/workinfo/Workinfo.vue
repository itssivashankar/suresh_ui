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
      <div class="row">
        <div class="flex xs4 md4">
          <va-input 
                v-model="mall_given"
                type="text"
                label="Mall Given"
                pattern="^[A-Za-z]+$"
                :disabled="true"
              />
        </div>
        <div class="flex xs4 md4">
          <va-input
                v-model="mall_collected"
                type="text"
                label="Mall Collected*"
                :disabled="true"
              />
        </div>  
        <div class="flex xs4 md4">  
          <va-input v-model="mall_balance"
                type="text"
                label="Balance Mall"
                :disabled="true"
              />        
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
          <va-button flat small color="gray" icon="fa fa-remove" @click="delete_info(props.rowData)" class="ma-0"></va-button>
          <va-modal
            v-model="showRemoveModal"
            title="Delete info"
            size='small'
            :message="message"
            okText="Confirm"
            cancelText="Cancel"
            @ok="conform_delete()"
            @cancel="list()">
          </va-modal>   

        </template>
        <template slot="statusBtnCircle" slot-scope="props">
          <va-badge
            v-if="props.rowData.workinfo_type=='input'"
            class="ma-0 badge"
            color="danger"
            :disabled="true">
          </va-badge>
          <va-badge
            v-if="props.rowData.workinfo_type!=='input'"
            class="ma-0 badge"
            color="success"
            :disabled="true">
          </va-badge>
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
              :disabled="true"
              placeholder="Enter Worker Name"
              required="true"
            />
            <div class="flex xs12 sm6">
                <va-date-picker
                v-model="current_date"
                />
            </div>
             <va-select
              label="work_info_type"
              v-model="workinfo_type"
              textBy="id"
              :options="workinfo_type_options"
            />
            <div class="row" v-if="checkInput">
              <div class="flex xs12 md6">
                <va-input 
                  v-model="mall_given"
                  type="text"
                  label="Mall Given *"
                  pattern="^[0-9]+$"
                  placeholder="Enter Given Mall"
                  required="true"
                />
              </div>
              <div class="flex xs12 md4">
                <va-button type="button" v-if="check_testbutton" class="my-0" @click="check_test()">Check Balance</va-button>
              </div>
            </div>
            <div class="row" v-if="!checkInput">
              <div class="flex xs12 md6">
                <va-input v-if="!checkInput"
                  v-model="mall_collected"
                  type="text"
                  label="Mall Collected *"
                  pattern="^[0-9]+$"
                  placeholder="Enter Collected Mall"
                  required="true"
                />
              </div>
              <div class="flex xs12 md4">
                <va-button type="button" v-if="checkbutton" class="my-0" @click="check()">Check Balance</va-button>
              </div>
            </div>
            <va-input
              v-model="mall_balance"
              type="text"
              label="Mall Balance *"
              pattern="^[0-9]+$"
              placeholder="Enter Balance Mall"
              required="true"
              :disabled="isUpdate?true:false"
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
  name: 'workinfo',
  beforeCreate () {
    this.worker_name = Vue.prototype.$worker_name;
    
    this.$http.get(config.menu.host + 'api/workerinfo/'+Vue.prototype.$id).then(response => {
      console.log("kljkjhlkjhl",response.body)
      this.users = (response.body.length > 0) ? response.body : []
      console.log("response.body.length > 0",response.body.length)
      this.calculate(this.users);
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
      users: [],
      workinfo_type_options: ["input","output"],
      isshowgrid: false,
      isshowForm: false,
      isCreate: false,
      isUpdate: false,
      info_option: false,
      checkbutton: true,
      check_testbutton: true,
      worker_name: '',
      workinfo_type:'',
      mall_given: '',
      current_date: new Date().toJSON().slice(0,10).replace(/-/g,'-'),
      mall_collected: '',
      mall_balance:'',
      status: true,
      showRemoveModal: false,
      phone_number: '',
    }
  },
  computed: {
    checkInput() {
      return this.workinfo_type === "input";
      // return info_option;
    },
    calculate_balance (){
      console.log("calculate_balance called")
    },
    fields () {
      return [{
        name: '__slot:marker',
        width: '30px',
        dataClass: 'text-center',
      },
      {
        name: 'date',
        title: 'Date',
      },
      {
        name: 'worker_name',
        title: 'Worker Name',
      },
      {
        name: 'mall_given',
        title: 'Mall Given',
      },
      {
        name: 'mall_collected',
        title: 'Mall Collected',
      },
      {
        name: 'mall_balance',
        title: 'Balance',
      },
      {
          name: '__slot:statusBtnCircle',
          title: 'Status',
          width: '16%',
      },
      {
        name: '__slot:actions',
        dataClass: 'text-right',
      },
      {
        name: '__slot:info',
        dataClass: 'text-right',
      }]
    },
    filteredData () {
      var gridData = search(this.term, this.users)
      console.log(gridData)
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
    check(){
      console.log("in check")
      this.mall_balance=parseInt(this.mall_balance)-parseInt(this.mall_collected)
      this.checkbutton = false;
      this.check_testbutton = false;
    },
    check_test(){
      console.log("in check status",this.mall_balance)
      this.mall_balance=parseInt(this.mall_balance)+parseInt(this.mall_given)
      this.checkbutton = false;
      this.check_testbutton = false;
    },
    getAllUser () {
      this.$http.get(config.menu.host + 'api/workerinfo/'+Vue.prototype.$id).then(response => {
        this.users = (response.body.length > 0) ? response.body : []
        this.calculate(this.users);
      }, response => {
        console.log('USER ERR RESPONSE', response)
      })
    },
    calculate(data){
      console.log("calculate function",data);
      var mall_collected=0,mall_given=0;
      if(data.length == 0){
         this.mall_balance = 0
         this.mall_collected = 0
         this.mall_given = 0
      }else{
        for(var i=0;i<data.length;i++){
          if(data[i].workinfo_type=='input'){
            mall_given = parseInt(mall_given) + parseInt(data[i].mall_given);  
          }else{
            mall_collected = parseInt(mall_collected) + parseInt(data[i].mall_collected);
          }
          if(i==data.length-1){
            console.log("mall Given if condition"+mall_given)
            this.mall_given = mall_given
            this.mall_collected = mall_collected
            this.mall_balance = data[i].mall_balance;
          }
        }
      }  
    },
    createUser () {
      if(this.checkbutton){
        this.check();
      }
      if(this.check_testbutton){
        this.check_test();
      }
      var payload = {
        worker_id:Vue.prototype.$id,
        worker_name: this.worker_name,
        workinfo_type: this.workinfo_type,
        mall_collected:this.mall_collected,
        mall_given:this.mall_given,
        date:this.current_date
      }
      console.log("workerinfo",payload);
      this.$http.post(config.menu.host + 'api/workerinfo', payload).then(responseData => {
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
        mall_given:this.mall_given,
        mall_collected:this.mall_collected,
        workinfo_type:this.workinfo_type,
        phone_number: this.phone_number,
        mall_balance: this.mall_balance
      }
      this.$http.put(config.menu.host + 'api/workerinfo/' + this.user_id, payload).then(responseData => {
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
      this.workinfo_type = row.workinfo_type
      this.status = row.status?true:false
      this.user_id = row.id
      this.role = row.role
      this.isshowgrid = false
      this.isshowForm = true
      this.isCreate = false
      this.isUpdate = true
    },
    add () {
      this.worker_name = Vue.prototype.$worker_name
      this.mall_collected = ''
      this.mall_given = ''
      this.mobile_number = ''
      this.phone_number = ''
      this.isshowForm = true
      this.isshowgrid = false
      this.isUpdate = false
      this.isCreate = true
    },
    delete_info(row){
      this.showRemoveModal = true
      this.message = 'Press Confirm to Delete Data?'
       this.user_id = row.id
    },
    conform_delete(){
      var payload = {
        worker_name: row.worker_name,
        mall_given:row.mall_given,
        mall_collected:row.mall_collected,
        phone_number: row.phone_number,
        mall_balance: row.mall_balance
      }
       this.$http.delete(config.menu.host + 'api/workerinfo/' + this.user_id, payload).then(responseData => {
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
        this.list();
    },
    list () {
      this.getAllUser()
      this.isshowForm = false
      this.isshowgrid = true
    },
    search: function (term) {
      console.log(term)
      this.term = term
    },
  },
}
</script>

<style lang="scss">
</style>
