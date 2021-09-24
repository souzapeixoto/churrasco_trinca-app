<template>
  <v-app>
    <component :is="layout"></component>
    
  </v-app>
</template>

<script>
const default_layout = "default";
export default {
  name: 'App',
  
  components: {
    
  },
  computed:{
    layout(){
      return (this.$route.meta.layout || default_layout) + '-layout';
    },
    
  },

};
</script>