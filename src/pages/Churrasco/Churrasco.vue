<template>
  <v-row>
    <v-col  v-for="churrasco in churrascos" :key="churrasco.id" cols="12" sm="3">
      <Card :churrasco="churrasco"></Card>
    </v-col>

  
  <v-container v-show="Object.keys(churrascos).length === 0" align="center">
      <v-responsive :max-height="270" aspect-ratio="4/4">
          <v-img
            class="pb-0 mb-0"
            contain
            height="200"
            src="@/assets/barbecue.png"
          >
          </v-img>
          
        </v-responsive>
        <h1 class="mt-10" align="center">Você não tem nenhum Churras marcado. Clique no botão azul a direita da tela e bóra marcar!</h1>
          
    </v-container>
  </v-row>
</template>
<script>
import Card from "./components/CardInfoComponent.vue";
export default {
  name: "Churrasco",

  data: () => ({
    churrascos: [],
  }),
  components: {
    Card,
  },
  created() {
    let self = this;
    this.$http.get("churrascos").then(function(response) {
      self.churrascos = response.data;
    });
  },
};
</script>
