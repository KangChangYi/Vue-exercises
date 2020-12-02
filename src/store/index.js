import Vue from "vue";
// import Vuex from "vuex";
import Vuex from "./myVuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    number: 1,
    one: 1
  },
  mutations: {
    SET_NUMBER_PULS: (state, number) => {
      state.number = number;
    }
  },
  actions: {
    numberPlus({ commit }, payload) {
      commit("SET_NUMBER_PULS", payload);
    }
  },
  getters: {
    getDouble(state) {
      return state.one * 2;
    },
    getDoubleNumber(state, getters) {
      return state.number * getters.getDouble;
    }
  },
  modules: {}
});
