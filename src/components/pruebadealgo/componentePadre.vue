<template>
  <div>
    <label for="nombre">Nombre:</label>
    <input type="text" id="nombre" v-model="usuario.user">
    <br>
    <label for="email">Email:</label>
    <input type="email" id="email" v-model="usuario.email">
    <br>
    <button @click="guardarCambios">Guardar Cambios</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usedataStore } from '../../store/datoUsuario';
import { IdUsuario } from '../../types/index';

// Suponiendo que dataStore es el objeto que contiene tus datos
const dataStore = usedataStore()
// Definir las props esperadas en el componente
const props = defineProps(['id']);

// Simulación de datos (reemplaza esto con tu lógica real)
const Idusers = ref<IdUsuario[]>([]); // Suponiendo que IdUsuario es el tipo de dato para los IDs de usuarios
const usuarios = ref(dataStore.dataUsers);

// Definir el objeto 'usuario' para almacenar los datos del usuario seleccionado
const usuario = ref({ id: '', user: '', email: '' });

// Método para obtener los datos del usuario por su ID
const obtenerDatosUsuario = (id: string | number) => {
  const usuarioEncontrado = usuarios.value.find(user => user.id === id);
  if (usuarioEncontrado) {
    usuario.value = { ...usuarioEncontrado };
  } else {
    // Manejar el caso en el que no se encuentre el usuario
    console.error('Usuario no encontrado');
  }
};

// Llamar a obtenerDatosUsuario con el ID de la prop 'id' (pasada desde el componente padre)
obtenerDatosUsuario(props.id); // props.id contiene el ID del usuario seleccionado

// Método para guardar cambios
const guardarCambios = () => {
  // Aquí puedes implementar la lógica para guardar los cambios del usuario
  console.log('Cambios guardados:', usuario.value);
};
</script>
