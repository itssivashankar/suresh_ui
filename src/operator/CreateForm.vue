<template>
  <div class="container">
    <va-select
      label="Operator Organization"
      v-model="org_nameVal"
      textBy="name"
      :options="org_name"
      placeholder="Operator Organization"
    />
    <va-input
      label="Operator Name"
      v-model="dom_name"
      placeholder="Operator Domain Name"
    />
    <va-input
      label="Brand Colour"
      v-model="brd_clr"
      placeholder="Brand Colour"
      pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
      maxlength = "7"
    />
    <va-input
      label="Secondary Colour"
      v-model="sec_color"
      placeholder="Secondary Colour"
      pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
      maxlength = "7"
    />
    <va-input
      label="Text Colour"
      v-model="txt_color"
      placeholder="Text Input"
      pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
      maxlength = "7"
    />
    <label>Logo:</label><br>
    <input type="file" id="logo" v-on:change="validateLogo($event)" ><br>

    <label>Brand Video:</label><br>
    <input type="file" id="brd_vid" v-on:change="validateBrd_vid($event)" accept=".mp4"><br>

    <label>Brand Image:</label><br>
    <input type="file" id="brd_img" v-on:change="validateBrd_img($event)"  ><br>

    <input type="submit" v-on:click="onSubmit">
  </div>
</template>

<script>
import Vue from 'vue'
import vueResource from 'vue-resource'
Vue.use(vueResource)

export default {
  data () {
    return {
      dom_name: '',
      brd_clr: '',
      sec_color: '',
      txt_color: '',
      org_nameVal: '',
      logo: null,
      brd_vid: null,
      brd_img: null,
      org_name: [
        {
          id: 1,
          name: 'Infynect',
        },
      ],
    }
  },
  methods: {
    validateLogo (eve) {
      console.log(this)
      var logoImg = eve.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(eve.target.files[0])
      reader.onload = function (e) {
        var image = new Image()
        image.src = e.target.result
        image.onload = function () {
          var height = this.height
          var width = this.width
          if (height <= 512 && width <= 512) {
            const formData = new FormData()
            formData.append('logo', logoImg)
            this.logo = formData
            return true
          } else {
            alert('please upload image less than 512 pixels')
            document.getElementById('logo').value = ''
            return false
          }
        }
      }
    },
    validateBrd_vid (eve) {
      var brd_vid = eve.target.files[0]
      if (eve.target.size < 10000) {
        const formData = new FormData()
        this.formData.append('brd_vid', brd_vid)
        this.brd_vid = formData
        return true
      } else {
        alert('please upload video less than 10 mb')
        document.getElementById('brd_vid').value = ''
        return false
      }
    },
    validateBrd_img (eve) {
      console.log(this.brd_clr)
      var brd_Img = eve.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(eve.target.files[0])
      reader.onload = function (e) {
        var image = new Image()
        image.src = e.target.result
        image.onload = function () {
          var height = this.height
          var width = this.width
          if (height <= 512 && width <= 593) {
            const formData = new FormData()
            formData.append('brd_img', brd_Img)
            this.brd_img = formData
            return true
          } else {
            alert('please upload image less than 512 pixels')
            document.getElementById('brd_img').value = ''
            return false
          }
        }
      }
    },
    onSubmit () {
      const payload = {
        dom_name: this.dom_name,
        brd_clr: this.brd_clr,
        sec_color: this.sec_color,
        txt_color: this.txt_color,
        org_nameVal: this.org_nameVal,
        logo: this.logo,
        brd_vid: this.brd_vid,
        brd_img: this.brd_img,
      }
      if (payload.dom_name === '' || payload.brd_clr === '' || payload.sec_color === '' || payload.txt_color === '' || payload.org_nameVal === '') {
        alert('All Fields Required!')
      } else {
        console.log(payload)
      }
    },
  },
}
</script>

<style>
  /* .files {
    display: flex;
  } */
</style>
