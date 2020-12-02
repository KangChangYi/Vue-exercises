import Vue from "vue";
// import VueRouter from "vue-router";
import VueRouter from "./myVueRouter";
import Home from "../views/Home.vue";
// import Home1 from "../views/Home1.vue";
// import Home2 from "../views/Home2.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
    // children: [
    //   {
    //     path: "/home1",
    //     name: "Home1",
    //     component: Home1
    //   },
    //   {
    //     path: "/home2",
    //     name: "Home2",
    //     component: Home2
    //   }
    // ]
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
