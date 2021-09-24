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
            <div class="title font-weight-light mb-2">Cadastre-se</div>

            <v-text-field
              v-model="register.nome"
              label="Nome"
              :error-messages="nomeErrors"
            ></v-text-field>
            <v-text-field
              v-model="register.email"
              :error-messages="emailErrors"
              label="E-mail"
              required
            ></v-text-field>
            <v-text-field
              v-model="register.password"
              :error-messages="passwordErrors"
              type="password"
              label="Password"
              required
            ></v-text-field>
            <v-text-field
              v-model="register.confirmPassword"
              :error-messages="confirmPasswordErrors"
              type="password"
              label="Confirm Password"
              required
            ></v-text-field>
            <v-btn color="success" width="100%" @click="submit">
              Cadastrar
            </v-btn>

            <v-divider class="my-2"></v-divider>

            <span class="caption grey--text font-weight-light"
              >Churras Trinca. since 2021</span
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import Vue from 'vue'
import {
  required,
  sameAs,
} from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],

  validations: {
    register: {
      nome: { required },
      password: { required },
      email: { required },
      confirmPassword: { required, sameAs: sameAs(function() { return this.register.password }) },
    },
  },

  data: () => ({
    register: {
      password: "",
      email: "",
      nome: "",
      confirmPassword: "",
    },
  }),

  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.register.email.$dirty) return errors;
      !this.$v.register.email.required && errors.push("Email é obrigatório");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.register.password.$dirty) return errors;
      !this.$v.register.password.required && errors.push("Senha é obrigatória");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.register.confirmPassword.$dirty) return errors;
      !this.$v.register.confirmPassword.required &&
        errors.push("Campo obrigatório");
      !this.$v.register.confirmPassword.sameAs &&
        errors.push("Senha não confere");
      return errors;
    },

    nomeErrors() {
      const errors = [];
      if (!this.$v.register.nome.$dirty) return errors;
      !this.$v.register.nome.required && errors.push("Nome é obrigatório.");
      return errors;
    },
  },

  methods: {
    submit() {
      let self = this;
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      this.$http
        .post(
          "Account/Register",
          this.$qs.stringify(this.register)
        )
        .then(function(response) {
          Vue.$toast.success(
            response.data
              ? response.data.message
              : "Cadastro realizado com sucesso!"
          );
          self.$router.push({ name: "login" });
        })
        .catch(function(error) {
          Vue.$toast.error(
            error.response ? error.response.data :
            "Não foi possivel realizar o cadastro, tente mais tarde."
          );
        });
    },
  },
};
</script>

<style></style>
