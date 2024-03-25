<template>
    
</template>

<script lang="ts" setup>
</script>

<style>
</style>
<!-- <template>
    <form>
        <div>
            <label for="username">Username:</label>
            <input type="text" id="UserName" v-model="Usuarios.UserName" placeholder="Usuario" />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="UserPassword" v-model="Usuarios.UserPassoword" placeholder="Contraseña"/>
        </div>
        <div>
            <input type="checkbox" v-model="Usuarios.UserCheckbox"> Recordar contraseña
        </div>
        <div>
            <button @click="handleAddUsuarios">Iniciar Sesion</button>
        </div>
    </form>
        <UserTable  v-for="elm in usuariosS" :key="elm.UserName" :userName="elm.UserName" :password="elm.UserPassoword" :checkbox="elm.UserCheckbox" />
  </template>
  

  
<script lang="ts" setup>
import UserTable from '../components/UserTable.vue'
import { Ref, ref } from "vue";


interface IdUsuarios{
    UserName: string
    UserPassoword:string
    UserCheckbox: boolean
}

let Usuarios:Ref<IdUsuarios> = ref({
    UserName:'',
    UserPassword:'',
    UserCheckbox: false
})

let usuariosS:Ref<Array<IdUsuarios>> = ref([])

    const handleAddUsuarios = () => {
        usuariosS.value.push({
            UserName: Usuarios.value.UserName,
            UserPassoword: Usuarios.value.UserPassoword,
            UserCheckbox: Usuarios.value.UserCheckbox,
        })

        Usuarios.value.UserName="",
        Usuarios.value.UserPassoword="",
        Usuarios.value.UserCheckbox= false
    }




</script>

<style>

</style>
 
   -->