<template>
  <v-footer dark padless>
    <v-card class="flex" color="secondary" flat tile>
      <v-card-title>
        <strong class="subheading"
          >Conecte-se com a gente em nossas redes sociais! ; )</strong
        >

        <v-spacer></v-spacer>

        <v-btn
          :href="icon.route"
          target="_blank"
          v-for="icon in icons"
          :key="icon.icon"
          class="mx-4"
          dark
          icon
        >
          <v-icon size="24px">
            {{ icon.icon }}
          </v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: [{icon:"mdi-facebook", route:"https://www.facebook.com/trinca137"}, {icon:"mdi-linkedin",route:"https://www.linkedin.com/company/trinca137/"},{icon:"mdi-instagram",route:"https://www.instagram.com/trinca137/"}],
  }),
};
</script>
