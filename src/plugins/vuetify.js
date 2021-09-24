import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: '#ff5708',
            secondary: '#272727',
            third: '#d3b933',         
          },
        },
      },
});