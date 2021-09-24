<template>
  <v-speed-dial
  class="md-bottom-right md-fixed"
    v-model="fab"
    :bottom="bottom"
    :right="right"
    :direction="direction"
    :transition="transition"
    
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="blue darken-2" dark fab x-large>
        <v-icon v-if="fab">
          mdi-emoticon-cool
        </v-icon>
        <v-icon v-else>
          mdi-grill
        </v-icon>
      </v-btn>
    </template>
    <v-tooltip disabled left :value="true" >
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" 
          v-on="on" fab dark small color="green" slot="activator" @click='goToNewChurras()'>
      <v-icon>mdi-grill</v-icon>
    </v-btn>
        </template>
     
      <span>Marcar um churras!</span>
    </v-tooltip>
    <v-tooltip disabled left :value="true" >
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" 
          v-on="on" fab dark small color="green" slot="activator" @click='goToChurrascos()'>
      <v-icon>mdi-calendar-heart</v-icon>
    </v-btn>
        </template>
     
      <span>Churrascos marcados!</span>
    </v-tooltip>
    
  </v-speed-dial>
</template>
<script>
import {  mapActions } from "vuex";
export default {
    
  data: () => ({
    direction: "top",
    fab: false,
    fling: true,
    hover: false,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    absolute:false,
    fixed:false,
    transition: "slide-y-reverse-transition",
  }),
  methods: {
    ...mapActions('home', ['OpenModalNovoChurrasco']),
    async goToNewChurras(){
        await this.$router.push({ name: "createchurras" }).catch(()=> {})
    },
    async goToChurrascos(){
        await this.$router.push({ name: "churrascos" }).catch(()=> {})
    }
  }
};
</script>


