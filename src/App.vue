<template>
    <Nav-bar />
    <router-view />
    <credentialsTableAdmin />
    <add-new-user />
    <componentePadre />
    <usuarios />
    <credential-register />
    <credentials-create />
    <componente-padre />
</template>

<script lang="ts" setup>
import { credentialsTableAdmin } from './importFile';
import componentePadre from './components/pruebadealgo/componentePadre.vue';
// import credentialRegister from './view/adminView/credentialRegister.vue';
// import credentialsCreate from './view/adminView/credentialsCreate.vue';
// import { usuarios } from './importFile';
// import addNewUser from './view/adminView/addNewUser.vue';
// import credentialsClient from './view/clientView/credentialsClient.vue';
// import componentePadre from './components/pruebadealgo/componentePadre.vue';



</script>

<style></style>
