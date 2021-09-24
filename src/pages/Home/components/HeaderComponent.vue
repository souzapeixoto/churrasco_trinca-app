<template>
  <v-app-bar dark color="primary" class="mb-5">
    <v-app-bar-nav-icon @click="TOGGLE_HOME_NAVIGATION_DRAWER"></v-app-bar-nav-icon>
    <v-toolbar-title
      ><h2>Churras Trinca</h2>
      
      </v-toolbar-title>
  </v-app-bar>
</template>

<script>
import {mapActions} from "vuex"
export default {
 
  methods:{
    ...mapActions('home', ['TOGGLE_HOME_NAVIGATION_DRAWER']),
  }
  
}
</script>