export default {
    namespaced:true,
    state: () => ({
      usuario: {
        nome:"",
        email:"",
        id:""
      }
    }),
    actions: {
        SET_CURRENT_USER(context, user) {
          context.commit('SET_CURRENT_USER', user)
        },
      },
    mutations: {
        SET_CURRENT_USER:(state,payload)=> {
        console.log(state.drawer)
        // `state` is the local module state
        state.currentUser = payload
      }
    },
    
    
   
  }