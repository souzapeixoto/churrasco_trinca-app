import Vue from "vue"
import Vuex from "vuex"
import home from "./pages/Home/store/index"
import usuario from "./pages/Usuario/store/index"

Vue.use(Vuex)

 export default new Vuex.Store({
    modules: {
      home,
      usuario

    }
  })