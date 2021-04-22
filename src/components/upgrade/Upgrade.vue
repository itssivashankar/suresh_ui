<template>
  <div>
    <div v-if="isshowgrid">
      <va-card title="Upgrade Code">
        <!-- <input type="file" @change="checkBackupfile" accept=".7z,.7zip"/> -->
         <div class="flex md12 sm12 xs12">
                <input type="file" ref="sourcefile" style="display: none;" id="sourcefile" v-on:change="validateback_image($event)" accept=".7z,.7zip"><br>
                <va-button type="submit" class="my-0" @click.prevent="$refs.sourcefile.click()">Upload</va-button>
                <label>{{ file_name }}</label>
        </div>
        <div class="d-flex justify--center mt-3">
          <va-button type="submit" icon="entypo entypo-ccw" class="my-0" @click.prevent="restoreBackup()">Submit</va-button>
        </div>
      </va-card>
    </div>
    <va-modal
      v-model="showRemoveModal"
      title="DB Backup"
      size='small'
      :message="message"
      okText="Confirm"
      cancelText="Cancel"
      @ok="createBackup()"
      @cancel="list()">
    </va-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import vueResource from 'vue-resource'
import config from '../../i18n/en.json'
Vue.use(vueResource)

export default {
  name: 'upgrade',
  data () {
    return {
       errors: {
        sourcefile: false,
      },
      term: null,
      perPage: '6',
      perPageOptions: ['4', '6', '10', '20'],
      genres_data: [],
      isshowgrid: true,
      isCreate: false,
      isUpdate: false,
      file_name : '',
      source_data : [],
      showRemoveModal: false,
      message: '',
    }
  },
  computed: {
    fileupload_check () {
      if (this.source_data != '') {
        return true
      } else {
        this.call_notification('please Upload a file')
        return false
      }
    },
  },
  methods: {
    validateback_image (eve) {
      this.source_data = eve.target.files[0]
      this.file_name = this.source_data.name
    },
    checkBackupfile (element) {
      var file = element.target.files[0]
      this.tar_file = file
      var filename = file.name
      if (filename >= 0) {
        this.call_notification('please check the file name [year-month-date]')
      }
    },
    restoreBackup () {
      if (!this.fileupload_check) return
      if (!confirm('Are you sure want to Update?')) return
      var payload = new FormData()
      payload.append('source_data', this.source_data)
      const loader = Vue.$loading.show({ width: 40, height: 40 })
      this.$http.post(config.menu.host + 'api/upgrade', payload).then(responseData => {
        if (responseData && responseData.body) {
          loader.hide()
          Vue.notify({
            text: 'Restored Successfully',
            type: 'success',
          })
          this.list()
        }
        this.list()
      }, errResponse => {
        if (errResponse && errResponse.body) {
          loader.hide()
          Vue.notify({
            text: errResponse.body,
            type: 'error',
          })
        }
        this.list()
      })
    },
    backup () {
      this.showRemoveModal = true
      this.message = 'Press Confirm to Backup DB?'
    },
    list () {
      this.isshowgrid = true
      this.file_name = ''
      this.source_data = []
    },
    call_notification (message) {
      Vue.notify({
        text: message,
        type: 'error',
      })
    },
  },
}
</script>
