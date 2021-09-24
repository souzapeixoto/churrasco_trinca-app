import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Churrasco from "../pages/Churrasco/Churrasco";
import CreateChurras from "../pages/Churrasco/CreateChurras";
import EditChurras from "../pages/Churrasco/EditChurras";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { layout: "login" },
  },

  { path: "/", redirect: "/churrascos" },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { layout: "register" },
  },
  { path: "/churrascos", name: "churrascos", component: Churrasco },
  {
    path: "/churrascos/create",
    name: "createchurras",
    component: CreateChurras,
  },
  {
    path: "/churrascos/edit/:id",
    name: "editchurras",
    component: EditChurras,
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  routes, // short for `routes: routes`
});

export default router;
