<template>
  <v-app-bar app dark flat>
    <v-container class="py-0 fill-height">
      <svg width="50" height="50" viewBox="0 0 56 56" fill="none">
        <path
          d="M56 56H0V0H56V56ZM1.86085 54.1391H54.1391V1.86085H1.86085V54.1391Z"
          fill="white"
        ></path>
        <path
          d="M13.7433 19.2288H11.1653V17.5424C13.627 17.5424 15.7011 17.5424 18.1822 17.5424V19.2288H15.6042V26.0132H13.724V19.2288H13.7433Z"
          fill="white"
        ></path>
        <path
          d="M32.0805 25.7805H29.9871L27.8161 23.0086H26.4592V25.7805H24.579V17.3292C25.9552 17.3292 27.2346 17.3292 28.5914 17.3292C30.6267 17.3292 31.7122 18.686 31.7122 20.1786C31.6929 21.2835 31.3827 22.2527 29.7545 22.8342L32.0805 25.6448V25.7805ZM26.4592 18.9574V21.4192H28.6108C29.4831 21.4192 29.8514 20.7601 29.8514 20.2367C29.832 19.6552 29.4637 18.9574 28.5914 18.9574H26.4592Z"
          fill="white"
        ></path>
        <path
          d="M39.5045 25.6836V17.2129H41.3848V25.6643H39.5045V25.6836Z"
          fill="white"
        ></path>
        <path
          d="M16.7673 35.7051L16.651 33.0495V30.2001H18.5506V38.6514H16.9224L12.7161 33.2433L12.7936 36.0152V38.6514H10.8746V30.2001H12.5029L16.7673 35.7051Z"
          fill="white"
        ></path>
        <path
          d="M31.9255 37.314C31.0532 38.1669 29.9289 38.5545 28.669 38.5545C25.4513 38.5545 24.1525 36.4805 24.1525 34.1738C24.1332 31.9834 25.5676 29.6961 28.669 29.6961C29.832 29.6961 30.8981 30.1419 31.7704 30.9948L30.588 32.1579C30.084 31.6539 29.3474 31.46 28.669 31.46C26.75 31.46 25.994 32.9526 26.0134 34.1738C26.0328 35.4143 26.6918 36.81 28.669 36.81C29.3474 36.81 30.2391 36.4998 30.7431 35.9959L31.9255 37.314Z"
          fill="white"
        ></path>
        <path
          d="M42.4701 37.3333H38.1281L37.5078 38.7871H35.4725L39.2718 30.3358H41.3265L45.1257 38.7871H43.0904L42.4701 37.3333ZM40.2991 32.2354L38.8453 35.6663H41.7529L40.2991 32.2354Z"
          fill="white"
        ></path>
      </svg>

      <v-spacer></v-spacer>
      <v-responsive max-width="750">
        <h2 class="align-right">Churras Trinca</h2>
      </v-responsive>

      <v-responsive max-width="260">
        <h3 color="white">Olá, {{ user.nome }}</h3>
      </v-responsive>
      <v-btn
        class="ma-1"
        color="primary"
        plain
        @click="deleteAllCookies()"
      >
        Logout
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("home", ["TOGGLE_HOME_NAVIGATION_DRAWER"]),
    deleteAllCookies() {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      localStorage.clear();
      this.$router.push({ name: "login" });
    },
  },
  computed: {
    ...mapState("usuario", ["user"]),
  },
};
</script>
