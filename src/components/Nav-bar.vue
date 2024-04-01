<template>
  <nav app class="styleNav" v-if="$route.meta.showNavbar">
    <router-link class="styleLink" to="/Home">Home</router-link>
    <router-link class="styleLink" to="/Users">Users</router-link>
    <router-link class="styleLink" to="/Credentials">Credentials</router-link>
    <!-- <router-link class="styleLink" to="/crear">Registrar credenciales</router-link>
            <router-link class="styleLink" to="/agregar">agregar</router-link> -->
  </nav>

</template>


<script lang="ts" setup>
import { useRoute } from 'vue-router';
const $route = useRoute();
</script>

<style>
.styleNav {
  background-color: #4682b4;
  height: 60px;
  padding-top: 15px;
  padding-left: 50px;
  font-weight: bold;
}

.styleLink {
  text-decoration: none;
  color: white;
  font-weight: bold;
  margin-top: 10px;
  margin: 20px;

}

.styleLink:hover {
  color: blue;
}
</style>