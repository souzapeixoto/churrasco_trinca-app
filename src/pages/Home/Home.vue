<template>
  <v-main>
    <HeaderComponent />

    <v-container>
      <router-view> </router-view>
      <div class="fixed" id="create">
        <FloatButtonComponent />
      </div>
    </v-container>

    <div class="ft">
      <FooterComponent />
    </div>
  </v-main>
</template>
<script>
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import FloatButtonComponent from "@/components/FloatButtonComponent";
import { mapActions } from "vuex";

export default {
  name: "Home",
  components: {
    HeaderComponent,
    FooterComponent,
    FloatButtonComponent,
  },

  computed: {
    usuarioBD() {
      return localStorage.getItem("usuario");
    },
  },

  created: function() {
    this.carregaUsuario();
  },

  methods: {
    ...mapActions("usuario", ["GET_USER"]),
    ...mapActions("usuario", ["SET_USER"]),

    async carregaUsuario() {
      if (this.usuarioBD == null || typeof usuarioBD === "undefined") {
        if (this.usuario == null || typeof this.usuario === "undefined") {
          await this.GET_USER();
        }
        console.log(this.usuario);
        await localStorage.setItem("usuario", JSON.stringify(this.usuario));
      } else {
        let userStorage = JSON.parse(this.usuarioBD);
        await this.SET_USER(userStorage);
      }
      console.log("Usuario caregado");
    },
  },
};
</script>
<style scoped>
/* This is for documentation purposes and will not be needed in your application */
.fixed {
  position: fixed;
  bottom: 120px;
  right: 32px;
}

.ft {
  background: #c590f5;

  position: absolute;
  top: 100%;
  width: 100%;
}
</style>
