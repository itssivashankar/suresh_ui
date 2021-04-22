<template>
  <div v-if="isOrgs" class="orgs">
    <va-card title="Operator Details">
      <template slot="actions">
        <va-button :disabled="apkProgress" color="success" icon="fa fa-plus" @click="addNew">Add</va-button>
        <va-button v-if="selectedOperators.length === 0" :disabled="apkProgress || (!orgs.length)" icon="fa fa-upload" @click="updateAll">Update All</va-button>
        <va-button v-if="selectedOperators.length > 0" :disabled="(!selectedOperators.length)" icon="fa fa-refresh" @click="updateOperator">Update</va-button>
      </template>
      <div class="row">
        <div class="flex xs12 md6">
          <va-input
            :value="term"
            placeholder="search"
            @input="search"
            removable>
            <va-icon name="fa fa-search" slot="prepend" />
          </va-input>
        </div>
      </div>
      <va-data-table
        style="max-height: 60vh;"
        :fields="fields"
        :data="filteredData"
        :per-page="parseInt(filteredData.length)">
        <template slot="checkbox" slot-scope="props">
          <input
            type="checkbox"
            :value="props.rowData"
            :disabled="apkProgress"
            v-model="selectedOperators"
          />
        </template>
        <template slot="actions" slot-scope="props">
          <va-button :disabled="(selectedOperators.length > 0) || apkProgress" flat small color="gray" icon="fa fa-pencil" @click="editOrg(props.rowData)" class="ma-0"></va-button>
        </template>
        <template slot="status" slot-scope="props">
          <!-- <va-button flat medium color="red" :icon="getStatusIcon()" class="ma-0"></va-button> -->
          <va-button v-if="props.rowData.status === 'errored'" flat medium color="red" icon="fa fa-exclamation-circle" class="ma-0"></va-button>
          <va-button v-if="props.rowData.status === 'finished'" flat medium color="green" icon="fa fa-check-circle" class="ma-0"></va-button>
          <va-button  v-if="props.rowData.status === 'progress'" flat medium color="blue" icon="fa fa-spinner fa-spin" class="ma-0"></va-button>
        </template>
      </va-data-table>
    </va-card>
  </div>

  <div v-else class="createOrg">
    <va-card :title="titleValue">
      <template slot="actions">
        <va-button color="gray" @click="addCancel">List</va-button>
      </template>
      <form @submit.prevent="isCreate?onCreate():onUpdate()">
        <div v-if="isCreate">
          <va-select
            label="Operator Organization *"
            v-model="org_info"
            textBy="org_name"
            :options="orgNameOptions"
            searchable
            placeholder="Select Operator Organization"
            required="true"
          />
        </div>
        <div v-else>
          <va-input
            label="Operator Organization Name"
            v-model="org_name"
            :disabled="true"
          />
        </div>
        <va-input
          label="Cdn URL *"
          v-model="cdn_url"
          placeholder="Example Domain.com , IP , IP:Port"
          pattern="^[0-9a-z:.//]+(?: +[0-9a-z:.//]+)*$"
          required="true"
        />
        <div v-if="isCreate">
          <va-select
            label="Timezone"
            v-model="timezone"
            :options="timezoneOptions"
            placeholder="Search"
            searchable
            required="true"
            noClear
          />
        </div>
        <div v-else>
          <va-input
            label="Timezone"
            v-model="timezone"
            :disabled="true"
          />
        </div>
        <va-input
          label="Operator Domain Prefix"
          v-model="operator_domain_prefix"
          placeholder="Operator Name"
          pattern="^[A-Za-z-()]+(?: +[A-Za-z-()]+)*$"
          required="true"
        />
        <div class="row">
          <div class="flex xs4 md2">
            <div class="vuestic-color-picker-page__top-square">
              <span
                class="title no-wrap"
                :style="{color: this.$themes.primary}"
              >
                Brand Color
              </span>
              <va-color-picker-input
                mode="advanced"
                v-model="brand_color">
                <va-color-square :value="brand_color"/>
              </va-color-picker-input>
            </div>
          </div>
          <div class="flex xs4 md2">
            <div class="vuestic-color-picker-page__top-square">
              <span
                class="title no-wrap"
                :style="{color: this.$themes.primary}"
              >
                Secondary Color
              </span>
              <va-color-picker-input
                mode="advanced"
                v-model="secondary_color">
                <va-color-square :value="secondary_color"/>
              </va-color-picker-input>
            </div>
          </div>
          <div class="flex xs4 md2">
            <div class="vuestic-color-picker-page__top-square">
              <span
                class="title no-wrap"
                :style="{color: this.$themes.primary}">
                Text Color
              </span>
              <va-color-picker-input
                mode="advanced"
                v-model="text_color"
              >
                <va-color-square :value="text_color"/>
              </va-color-picker-input>
            </div>
          </div>
        </div>
        <br>
        <div class="row">
          <div class="flex xs4 md2">
            <va-radio-button
              option="image"
              v-model="radioSelectedOption"
              label="Image"
            />
          </div>
          <div class="flex xs4 md2">
            <va-radio-button
              option="video"
              v-model="radioSelectedOption"
              label="Video"
            />
          </div>
        </div>
        <div class="row">
          <div class="flex md12 sm12 xs12">
            <input 
              type="file" 
              ref="logo" 
              style="display: none;" 
              id="logo" 
              v-on:change="validateLogo($event)" 
              accept=".png"><br>
            <p v-if="errors.logo" class="logo-required-error">Logo is Required</p>
            <va-button type="submit" class="my-0" @click.prevent="$refs.logo.click()">Upload Logo</va-button>
            <label>{{ operatorFileName }}</label>
          </div>
          <div v-show="radioSelectedOption !== 'image'" class="flex md12 sm12 xs12">
            <input type="file" ref="brand_video" style="display: none;" id="brandVideo" v-on:change="validateBrandVideo($event)" accept=".mp4"><br>
            <va-button type="submit" class="my-0" @click.prevent="$refs.brand_video.click()">Upload Brand Video</va-button>
            <label>{{ brandVideoFileName }}</label>
          </div>
          <div v-show="radioSelectedOption !== 'video'" class="flex md12 sm12 xs12">
            <input type="file" ref="brand_image" style="display: none;" id="brd_img" v-on:change="validateBrandImage($event)" accept=".png" ><br>
            <va-button type="submit" class="my-0" @click.prevent="$refs.brand_image.click()">Upload Brand Image</va-button>
            <label>{{ brandImageFileName }}</label>
          </div>
        </div>
        <br>
        <div class="d-flex justify--center mt-3">
          <va-button v-if="isCreate" type="submit" class="my-0">Create</va-button>
          <va-button v-else type="submit" class="my-0">Update</va-button>
          <va-button type="submit" class="my-0" @click.prevent="addCancel">Cancel</va-button>
        </div>
      </form>
    </va-card>
  </div>
</template>

<script>
import Vue from 'vue'
import vueResource from 'vue-resource'
import { search } from '../i18n/search.js'
import config from '../i18n/en.json'
import timezoneList from '../i18n/timezone.json'
import VueSimpleAlert from 'vue-simple-alert'
Vue.use(VueSimpleAlert)
Vue.use(vueResource)

export default {
  beforeCreate () {
    this.$http.get(config.menu.host + 'api/operator').then(response => {
      this.orgNameOptions = (response.body.length > 0) ? response.body : []
      this.isshowForm = false
      this.isshowgrid = true
      this.onGetAll()
      this.startTimer()
    }, err => {
      console.log('User get call error', err)
    })
  },
  beforeDestroy () {
    clearInterval(this.interval)
    this.mux_array = []
  },
  data () {
    return {
      errors: {
        logo: false,
        timezone: [],
      },
      orgs: [],
      isCreate: true,
      term: null,
      perPage: '7',
      isOrgs: true,
      single: [],
      operator_domain_prefix: '',
      brand_color: '#FF8505',
      secondary_color: '#0081FF',
      text_color: '#ffffff',
      org_info: 'qew',
      logo: null,
      brandVideo: null,
      brandImage: null,
      orgNameOptions: [],
      org_name: '',
      cdn_url:'',
      topAdvancedSquareColor: '#ffd50a',
      timezone: 'Asia/Kolkata',
      timezoneOptions: timezoneList.sort(),
      radioSelectedOption: 'image',
      operatorFileName: '',
      brandImageFileName: '',
      brandVideoFileName: '',
      tempUpdate: {},
      selectedOperators: [],
      apkProgress: false,
    }
  },
  methods: {
    getStatusIcon () {
      if (props.rowData.status === 'errored') {
        return 'fa fa-exclamation-circle'
      }
      if (props.rowData.status === 'progress') {
        return 'fa fa-spinner fa-spin'
      }
      if (props.rowData.status === 'finished') {
        return 'fa fa-check-circle'
      }
    },
    startTimer () {
      this.interval = setInterval(function () {
        if (this.isshowgrid && this.selectedOperators === 0) {
          this.onGetAll()
        }
      }.bind(this), 10000)
    },
    editOrg (org) {
      clearInterval(this.interval)
      console.log(org);
      this.timezone = org.timezone
      this.org_name = org.org_name
      this.operator_domain_prefix = org.operator_domain_prefix
      this.brand_color = org.brand_color
      this.secondary_color = org.secondary_color
      this.text_color = org.text_color
      this.cdn_url = org.cdn_url
      this.org_info = { org_id: org.org_id, org_name: org.org_name }
      this.isOrgs = false
      this.isCreate = false

      if (org.is_splash_video === 1) {
        this.isSplashVideo = true
        this.radioSelectedOption = 'video'
      } else {
        this.isSplashVideo = false
        this.radioSelectedOption = 'image'
      }
      this.tempUpdate.org_name = this.org_name
      this.tempUpdate.operator_domain_prefix = this.operator_domain_prefix
      this.tempUpdate.brand_color = this.brand_color
      this.tempUpdate.secondary_color = this.secondary_color
      this.tempUpdate.text_color = this.text_color
      this.tempUpdate.org_info = this.org_info
      this.tempUpdate.isOrgs = this.isOrgs
      this.tempUpdate.isCreate = this.isCreate
      this.tempUpdate.is_splash_video = this.isSplashVideo
      this.tempUpdate.cdn_url = this.cdn_url
      this.selectedOperators = []
    },
    search: function (term) {
      this.term = term
    },
    addCancel () {
      this.startTimer()
      this.isOrgs = !this.isOrgs
    },
    addNew () {
      clearInterval(this.interval)
      Object.assign(this.$data, this.$options.data())
      this.isOrgs = !this.isOrgs
      this.onGetAll()
    },
    updateAll () {
      this.selectedOperators = this.orgs
      this.$fire({
        text: 'Are you sure to update apk for all operators?',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        timer: 10000,
      }).then(res => {
        if (res.value) {
          this.updateOperator()
        } else {
          this.selectedOperators = []
        }
      })
    },
    updateOperator () {
      var payload = {}
      payload.selected_operators = this.selectedOperators
      this.$http.post(config.menu.host + 'api/operator/bulk/update', payload).then(responseData => {
        Vue.notify({
          text: responseData.body,
          type: 'success',
        })
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
    validateLogo (eve) {
      var logoImg = eve.target.files[0]
      const reader = new FileReader()
      var thisTemp = this
      reader.readAsDataURL(eve.target.files[0])
      reader.onload = function (e) {
        var image = new Image()
        image.src = e.target.result
        image.onload = function () {
          var height = this.height
          var width = this.width
          if (height === 512 && width === 512) {
            thisTemp.operatorFileName = logoImg.name
            thisTemp.logo = logoImg
            return true
          } else {
            thisTemp.operatorFileName = ''
            alert('please upload 512×512 px')
            document.getElementById('logo').value = ''
            return false
          }
        }
      }
    },
    validateBrandVideo (eve) {
      var brandVideo = eve.target.files[0]
      var size = eve.target.size
      if ((size / (1024 * 1024)) <= 200) {
        this.brandVideoFileName = brandVideo.name
        this.brandVideo = brandVideo
        return true
      } else {
        alert('please upload video less than 200 MB')
        this.brandVideoFileName = ''
        return false
      }
    },
    validateBrandImage (eve) {
      var thisTemp = this
      var brandImage = eve.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(eve.target.files[0])
      reader.onload = function (e) {
        var image = new Image()
        image.src = e.target.result
        image.onload = function () {
          var height = this.height
          var width = this.width
          if (height === 720 && width === 1280) {
            thisTemp.brandImageFileName = brandImage.name
            thisTemp.brandImage = brandImage
            return true
          } else {
            alert('please upload 1280×720 px')
            thisTemp.brandImageFileName = ''
            // document.getElementById('brd_img').value = ''
            return false
          }
        }
      }
    },
    onError () {
      if (this.isCreate) {
        this.logo === null ? this.errors.logo = true : this.errors.logo = false
      }
      if (this.isCreate && this.brandVideo === null && this.brandImage === null) {
        alert('Please upload brand Video or Image')
      }
    },
    onGetAll () {
      this.selectedOperators = []
      this.$http.get(config.menu.host + 'api/operator').then(response => {
        this.orgNameOptions = (response.body.length > 0) ? response.body : []
        this.$http.get(config.menu.host + 'api/operator/properties').then(response => {
          this.orgs = (response.body.length > 0) ? response.body : []
        }, err => {
          console.log('Operator org get call error', err)
        })
      }, err => {
        console.log('User get call error', err)
      })
    },
    onCreate () {
      if (this.org_info === '' || 
      this.brand_color === '' || 
      this.secondary_color === '' || 
      this.text_color === '' || 
      this.logo === null || 
      (this.brandVideo === null && this.brandImage === null)) {
        this.onError()
        return
      } else if (
        !new RegExp('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$').test(this.brand_color) ||
        !new RegExp('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$').test(this.secondary_color) ||
        !new RegExp('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$').test(this.text_color) ||
        !new RegExp('^[A-Za-z-()]+(?: +[A-Za-z-()]+)*$').test(this.operator_domain_prefix)) {
        return
      } else {
        var cdn_url = this.cdn_url;
        if (cdn_url.charAt(cdn_url.length -1) !== '/') {
          alert("CDN URL Should end with /");
          return;
        }
        var payload = new FormData()
        this.isSplashVideo = (this.radioSelectedOption !== 'image')
        payload.append('is_splash_video', this.isSplashVideo)
        payload.append('operator_domain_prefix', this.operator_domain_prefix)
        payload.append('org_id', this.org_info.org_id)
        payload.append('org_name', this.org_info.org_name)
        payload.append('brand_color', this.brand_color)
        payload.append('secondary_color', this.secondary_color)
        payload.append('text_color', this.text_color)
        payload.append('logo', this.logo)
        payload.append('cdn_url', this.cdn_url)

        if (this.isSplashVideo) {
          payload.append('brand_video', this.brandVideo)
        } else {
          payload.append('brand_image', this.brandImage)
        }
        payload.append('timezone', this.timezone)
        const loader = Vue.$loading.show({ width: 40, height: 40 })
        this.$http.post(config.menu.host + 'api/operator/properties', payload).then(responseData => {
          loader.hide()
          console.log(responseData);
          Vue.notify({
            text: responseData.body,
            type: 'success',
          })
          this.startTimer()
          this.onGetAll()
          this.list()
        }, errResponse => {
          console.log(errResponse);
          loader.hide()
          if (errResponse && errResponse.body) {
            Vue.notify({
              text: errResponse.body,
              type: 'error',
            })
          }
        })
      }
    },
    onUpdate () {
      const regex = RegExp('(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+@]*)*(\\?[;&a-z\\d%_.~+=-@]*)?(\\#[-a-z\\d_@]*)?$', 'i');
      if (this.operator_domain_prefix === '' || this.brand_color === '' || this.secondary_color === '' || this.cdn_url === '' || this.text_color === '' || this.org_info === '' || this.cdn_url === '') {
        this.onError()
      } else if (
        !new RegExp('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$').test(this.brand_color) ||
        !new RegExp('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$').test(this.secondary_color) ||
        !new RegExp('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$').test(this.text_color) ||
        !new RegExp('^[A-Za-z-()]+(?: +[A-Za-z-()]+)*$').test(this.operator_domain_prefix)) {
        this.onError()
      } else {
        var cdn_url = this.cdn_url;
        if (cdn_url.charAt(cdn_url.length -1) !== '/') {
          alert("CDN URL Should end with /");
          return;
        }
        this.isSplashVideo = (this.radioSelectedOption !== 'image')

        var tempUpdate = {}
        tempUpdate.org_name = this.org_name
        tempUpdate.operator_domain_prefix = this.operator_domain_prefix
        tempUpdate.brand_color = this.brand_color
        tempUpdate.secondary_color = this.secondary_color
        tempUpdate.text_color = this.text_color
        tempUpdate.org_info = this.org_info
        tempUpdate.isOrgs = this.isOrgs
        tempUpdate.isCreate = this.isCreate
        tempUpdate.is_splash_video = this.isSplashVideo
        tempUpdate.cdn_url = this.cdn_url

        if (JSON.stringify(tempUpdate) === JSON.stringify(this.tempUpdate)) {
          Vue.notify({
            text: 'Operator Details updated successfully',
            type: 'success',
          })
          this.list()
          return
        }

        var payload = new FormData()
        payload.append('is_splash_video', this.isSplashVideo)
        payload.append('operator_domain_prefix', this.operator_domain_prefix)
        payload.append('org_id', this.org_info.org_id)
        payload.append('org_name', this.org_info.org_name)
        payload.append('brand_color', this.brand_color)
        payload.append('secondary_color', this.secondary_color)
        payload.append('text_color', this.text_color)
        payload.append('logo', this.logo)
        payload.append('cdn_url', this.cdn_url)

        if (this.isSplashVideo) {
          payload.append('brand_video', this.brandVideo)
        } else {
          payload.append('brand_image', this.brandImage)
        }
        payload.append('timezone', this.timezone)
        const loader = Vue.$loading.show({ width: 40, height: 40 })
        this.$http.post(config.menu.host + 'api/operator/properties', payload).then(responseData => {
          loader.hide()
          Vue.notify({
            text: responseData.body,
            type: 'success',
          })
          this.startTimer()
          this.list()
        }, errResponse => {
          loader.hide()
          Vue.notify({
            text: errResponse.body,
            type: 'error',
          })
        })
      }
    },
    list () {
      this.isOrgs = true
      this.onGetAll()
    },
  },
  computed: {
    fields () {
      return [
        {
          name: '__slot:marker',
          width: '30px',
          dataClass: 'text-center',
        },
        {
          name: '__slot:checkbox',
          dataClass: 'text-right',
        },
        {
          name: 'org_name',
          title: 'Operator Organization',
        },
        {
          name: 'operator_domain_prefix',
          title: 'Operator Name',
        },
        {
          name: 'brand_color',
          title: 'Brand Color',
        },
        {
          name: 'secondary_color',
          title: 'Secondary Color',
        },
        {
          name: 'text_color',
          title: 'Text Color',
        },
        {
          name: '__slot:status',
          dataClass: 'text-center',
          title: 'Update Status',
        },
        {
          name: '__slot:actions',
        },
      ]
    },
    filteredData () {
      var apkProgressOrgs = this.orgs.filter(function (org) {
        return org.status === 'progress'
      })
      this.apkProgress = (apkProgressOrgs.length > 0)
      var orgs = search(this.term, this.orgs)
      return orgs
    },
    titleValue () {
      return this.isCreate ? 'Create Operator' : 'Update Operator'
    },
  },
}
</script>

<style>
.logo-required-error {
  color: red;
}

</style>
