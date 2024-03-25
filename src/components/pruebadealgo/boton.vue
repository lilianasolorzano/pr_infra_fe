<template>
  <button @click="handleClick">{{ buttonText }}</button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  globalAction: Function, // Prop que indica la acción global a realizar
});
props

const emits = defineEmits(['globalAction']); // Define el evento globalAction para emitir acciones globales

const handleClick = () => {
  emits('globalAction', 'global'); // Emitir la acción global al hacer clic en el botón
};

const buttonText = 'Botón Global'; // Texto del botón
</script>
