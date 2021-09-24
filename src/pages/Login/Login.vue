<template>
  <v-container>
    <v-row>
      <v-col cols="12" align="center">
        <v-responsive :max-height="270" aspect-ratio="4/4">
          <v-img
            class="pb-0 mb-0"
            contain
            height="200"
            src="@/assets/barbecue.png"
          >
          </v-img>
          <h1>Churras Trinca</h1>
        </v-responsive>

        <v-card max-width="400">
          <v-card-text class="pt-0">
            <div class="title font-weight-light mb-2">Login</div>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                type="password"
                label="Password"
                required
              ></v-text-field>

              <v-checkbox
                v-model="checkbox"
                label="me manter conectado?"
                required
              ></v-checkbox>

              <v-btn color="success" width="100%" @click="submit">
                Efetuar Login
              </v-btn>
            </v-form>
            <v-divider class="my-2"></v-divider>
            Ainda não se cadastrou?
            <v-btn
              class="ma-1"
              color="primary"
              plain
              @click="$router.push({ name: 'register' })"
            >
              Clique aqui!
            </v-btn><br/>
            <span class="caption grey--text font-weight-light"
              >Agenda Mestre since 2017</span
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    password: "",
    passwordRules: [(v) => !!v || "Senha é obrigatório"],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail é obrigatório",
      (v) =>
        !v ||
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail inválido",
    ],

    checkbox: false,
  }),

  methods: {
    submit() {
      let self = this;
      if (!this.$refs.form.validate()) {
        return;
      }

      this.$http
        .post(
          "Account/token",
          this.$qs.stringify({
            email: this.email,
            password: this.password,
            grant_type: "password",
          })
        )
        .then(function(response) {
          localStorage.setItem("access_token", response.data.token);
          localStorage.setItem("refresh_token", response.data.refreshToken);

          // ir para a home do sistema
          //location.href = '/index';
          self.$router.push({ name: "churrasco" });
        })
        .catch(function(error) {
          self.$toast.error(
            error.response
              ? error.response.data.error_description
              : "Não foi possivel realizar o login, tente mais tarde."
          );
        });
    },
  },
};
</script>

<style></style>
