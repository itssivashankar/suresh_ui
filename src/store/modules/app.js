const state = {
  sidebar: {
    opened: false,
  },
  config: {
    palette: {
      primary: '#4ae387',
      danger: '#e34a4a',
      info: '#4ab2e3',
      success: '#db76df',
      warning: '#f7cc36',
      white: '#fff',
      black: '#000',
      fontColor: '#34495e',
      transparent: 'transparent',
      lighterGray: '#ddd',
    },
    isProduction: 'true',
    dev: 'http://localhost:8001/api',
    production: 'https://core.livye.com/api',
  },
  isLoading: true,
}

const mutations = {
  setLoading (state, isLoading) {
    state.isLoading = isLoading
  },
}

const actions = {
}

export default {
  state,
  mutations,
  actions,
}
