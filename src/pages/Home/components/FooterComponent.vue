<template>
  <v-footer
    dark
    
    padless

    
  >
    <v-card
      class="flex"
      color="secondary"
      flat
      tile
    >
      <v-card-title>
        <strong class="subheading">Conecte-se com a gente em nossas redes sociais! ; )</strong>

        <v-spacer></v-spacer>

        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4"
          dark
          icon
        >
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-title>

      
    </v-card>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram',
      ],
    }),
  }
</script>
