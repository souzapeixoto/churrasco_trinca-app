<template>
  <v-row>
    <v-col v-for="churrasco in churrascos" :key="churrasco.id" cols="12" sm="3">
      <Card :churrasco="churrasco"></Card>
    </v-col>
    <v-col cols="12"></v-col>
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
