<template>
  <div id="app" class="app">
    <router-view />
    <notifications
      :duration="5000"
      :width="500"
      position="top right">
      <template slot="body" slot-scope="props">
        <div v-if="props.item.type=='success'">
          <va-notification style="padding: 0.7rem 0.5rem; margin: 0.15rem auto; background-color: #6ef599;">
            <va-badge> Success </va-badge>
            <div v-html="props.item.text"></div>
            <i class="fa fa-times" @click="props.close" style="margin-left: 190px;"></i>
          </va-notification>
        </div>
        <div v-if="props.item.type=='error'">
          <va-notification style="padding: 0.7rem 0.5rem; margin: 0.15rem auto; background-color: #ff4d64; color: #ffffff;">
            <va-badge color="danger"> Error </va-badge>
            <div v-html="props.item.text"></div>
            <i class="fa fa-times" @click="props.close" style="margin-left: 190px;"></i>
          </va-notification>
        </div>
      </template>
    </notifications>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      // Temporary config for 2.1.
      contextConfig: {
        gradient: true,
        shadow: 'lg', // 3 states: 'sm', 'lg', undefined (no shadow).
        invertedColor: false,
      },
    }
  },
  provide () {
    return {
      contextConfig: this.contextConfig,
    }
  },
  watch: {
    // Temporary colors fix for 2.1.
    'contextConfig.invertedColor' (val) {
      const invertedColorClass = 'va-inverted-color'
      if (val) {
        document.body.classList.add(invertedColorClass)
      } else {
        document.body.classList.remove(invertedColorClass)
      }
    },
  },
}
</script>

<style lang="scss">
@import '../sass/main.scss';

body {
  height: 100%;

  #app {
    height: 100%;
  }
}

.custom-template {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  text-align: left;
  font-size: 13px;
  margin: 5px;
  margin-bottom: 0;
  align-items: center;
  justify-content: center;

  &,
  & > div {
    box-sizing: border-box;
  }

  background: white;

  .custom-template-success-background {
    border: 2px solid green;
  }

  .custom-template-error-background {
    background: red;
    border: 2px solid red;
  }

  .custom-template-success-icon {
    flex: 0 1 auto;
    color: #15c371;
    font-size: 16px;
    padding: 0 10px;
  }

  .custom-template-error-icon {
    flex: 0 1 auto;
    color: red;
    font-size: 16px;
    padding: 0 10px;
  }

  .custom-template-close {
    flex: 0 1 auto;
    padding: 0 20px;
    font-size: 16px;
    opacity: 0.2;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .custom-template-content {
    padding: 10px;
    flex: 1 0 auto;

    .custom-template-title {
      letter-spacing: 1px;
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 600;
    }
  }
}
</style>
