import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    delay: 1000,
    pause: true
  },
  getters: {
    delay(state) {
      return state.delay;
    },
    pause(state) {
      return state.pause;
    }
  },
  mutations: {
  },
  actions: {
    increaseCycleDuration({ state }) {
      state.delay = state.delay + 10;
    },
    decreaseCycleDuration({ state }) {
      state.delay = state.delay - 10;
    },
    toggleActive({ state }) {
      state.pause = !state.pause;
    }
  },
  modules: {
  }
})
