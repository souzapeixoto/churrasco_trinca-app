import axios from "axios";

export default {
    namespaced:true,
    state: () => ({
      user: {}
    }),
    actions: {
        SET_USER(context, open) {
          context.commit('SET_USER', open)
        },
        
        GET_USER(context) {
           axios
            .get("usuarios")
            .then(function(response) {
                context.dispatch('SET_USER', response.data)
            })
            .catch(function(error) {
            return error
            });
        },

      },
    mutations: {
        SET_USER:(state,payload)=> {
        localStorage.setItem("usuario",JSON.stringify(payload))    
        state.user = payload
      }
    },
    
    
   
  }