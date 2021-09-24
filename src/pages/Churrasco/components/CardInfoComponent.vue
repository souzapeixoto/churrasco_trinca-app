<template>
  <v-card class="mx-auto" color="#26c6da" dark max-width="700" @click="goToEditChurras()">
    <v-card-title>
      <v-icon large left>
        mdi-grill-outline
      </v-icon>
      <span class="text-h6 font-weight-light">Churras!</span>
    </v-card-title>

    <v-card-text class="text-h5 font-weight-bold">
      {{ churrasco.descricao }}
    </v-card-text>

    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="primary">
          <v-icon>
            mdi-calendar-heart
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{moment(churrasco.data).format('DD/MM/YYYY')}}</v-list-item-title>
          
          <v-list-item-title>às {{moment(churrasco.data).format('HH:mm')}}</v-list-item-title>
        </v-list-item-content>

        <v-row align="center" justify="end">
          <v-icon class="mr-1">
            mdi-account-cash-outline
          </v-icon>
          <span class="subheading mr-2">R${{ churrasco.valorArrecadado }}</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">
            mdi-account-group-outline
          </v-icon>
          <span class="subheading">{{ churrasco.totalDeConvidados }}</span>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    churrasco: {
      required: true,
    },
  },
  data() {
    return {
      teste: null,
    };
  },
  methods:{
    goToEditChurras(){
      this.$router.push({ name: 'editchurras',params: { id: this.churrasco.id} })
    }
  }
};
</script>
