<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <div id="nav">
      <router-link to="/home1">to home1</router-link> |
      <router-link to="/home2">to home2</router-link>
    </div>
    {{ $store.state.number }}
    {{ $store.getters.getDoubleNumber }}
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  mounted() {
    // console.log(this.$store);
    // setTimeout(() => {
    // this.$store.commit("SET_NUMBER_PULS", 2);
    // this.$store.dispatch("numberPlus", 2);
    // }, 2000);
    // setInterval(() => {
    //   this.$store.commit("SET_NUMBER_PULS", this.$store.state.number + 1);
    // }, 1000);
  }
};
</script>
