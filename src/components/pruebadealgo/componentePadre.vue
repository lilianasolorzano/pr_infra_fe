<template>
  <div>
    <!-- Utiliza el componente de la tabla global y pasa las props necesarias -->
    <table :columns="tableColumns" :data="tableData" :buttons="tableButtons" />
  </div>
</template>

<script setup lang="ts">
import table from './table.vue'; // Importa el componente de la tabla global

// Define las variables con los datos y configuraciones de la tabla
const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  // Agrega más columnas según tus necesidades
];

const tableData = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  // Agrega más datos según tus necesidades
];

const tableButtons = [
  { label: 'Editar', action: ()=> handleEdit },
  { label: 'Eliminar', action: () => handleDelete },
  // Agrega más botones y acciones según tus necesidades
];

// Define las funciones para las acciones de los botones
const handleEdit = (item) => {
  console.log('Editar:', item);
  // Lógica para editar el elemento
};

const handleDelete = (item) => {
  console.log('Eliminar:', item);
  // Lógica para eliminar el elemento
};
</script>
