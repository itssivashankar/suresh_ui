import Vue from 'vue'

Vue.i18n.add('en', require('./en.json'))

// set the start locale to use
Vue.i18n.set('en')

// set fallback for non-translated strings
Vue.i18n.fallback('en')
