import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./services/router";
import store from "./store";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Qs from "qs";
import api from "./services/api";
import Toast from "vue-toastification";
import moment from "moment";
import money from 'v-money'
import "vue-toastification/dist/index.css";
require("moment/locale/pt-br");
Vue.use(money,{precision: 4})
Vue.config.productionTip = false
Vue.component("default-layout", Home);
Vue.component("login-layout", Login);
Vue.component("register-layout", Register);
Vue.prototype.$qs = Qs;
Vue.prototype.$http = api;
Vue.config.productionTip = false
Vue.prototype.moment = moment;
Vue.use(Toast, {});
Vue.use(Qs);
new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");

