import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    delay: 75,
    pause: true,
    ready: false
  },
  getters: {
    delay(state) {
      return state.delay;
    },
    pause(state) {
      return state.pause;
    },
    ready(state) {
      return state.ready;
    }
  },
  mutations: {
    ready(state, val: boolean) {
      state.ready = val;
    },
    delay(state, val) {
      state.delay = val;
    }
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
