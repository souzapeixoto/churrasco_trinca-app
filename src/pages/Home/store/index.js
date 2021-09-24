export default {
    namespaced:true,
    state: () => ({
      drawer: null,
    }),
    actions: {
        TOGGLE_HOME_NAVIGATION_DRAWER(context, open) {
          context.commit('TOGGLE_HOME_NAVIGATION_DRAWER', open)
        },
        OpenModalNovoChurrasco(context,){
          context.commit('OpenModalNovoChurrasco')
        }
      },
    mutations: {
        TOGGLE_HOME_NAVIGATION_DRAWER:(state,payload)=> {
        console.log(state.drawer)
        // `state` is the local module state
        state.drawer = payload
      },
     
    },  
  }