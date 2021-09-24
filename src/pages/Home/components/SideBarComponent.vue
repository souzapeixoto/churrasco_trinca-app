<template>
  <v-card class="mx-auto" max-width="300" tile>
    <v-navigation-drawer
      :value="drawer"
      :permanent="!$vuetify.breakpoint.xsOnly"
      light
      fixed
      app
      @input="TOGGLE_HOME_NAVIGATION_DRAWER"
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="user ? user.imagem :'' "></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="user.nome"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense shaped  class="tile">
        <v-subheader>MENU</v-subheader>

        <div v-for="item in items" :key="item.title">
          <v-list-group v-if="item.items" :prepend-icon="item.icon">
            <template v-slot:activator>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </template>

            <v-list-item-group>
              <v-list-item
                exact
                v-for="(child, i) in item.items"
                :key="i"
                class="ml-5"
                :to="{ name: child.route }"
              >
                <v-list-item-icon>
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-title>{{ child.title }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list-group>
          <template v-else>
            <v-list-item color="green" :to="{ name: item.route }" :key="item.title">
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </div>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      open: false,
      items: [
        { title: "Churrascos", icon: "mdi-view-dashboard", route: "churrascos" },
        
        { title: "Perfil", icon: "mdi-account", route: "perfil" },
      ],
    };
  },
  computed: {
    ...mapState("home", ["drawer"]),
    ...mapState("usuario", ["user"]),
  },
   methods: {
    ...mapActions("home", ["TOGGLE_HOME_NAVIGATION_DRAWER"]),
  },

  watch: {
    open(val) {
      return !val;
    },
  },
};
</script>
