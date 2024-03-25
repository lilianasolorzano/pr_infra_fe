<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(column, columnIndex) in columns" :key="columnIndex">{{ column.label }}</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td v-for="(column, columnIndex) in columns" :key="columnIndex">{{ item[column.key] }}</td>
          <td>
            <button v-for="(button, buttonIndex) in buttons" :key="buttonIndex" @click="handleButtonClick(button.action, item)">
              {{ button.label }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

// Define las props columns, data y buttons en tu componente GlobalTable
const props = defineProps({
  columns: {
    type: Object,
    required: true,
    default: () => ({ Label: '', key: '' }),
  },
  data: {
    type: Array as () => Record<string, any>[],
    required: true,
    default: () => [],
  },
  buttons:{
    type: Array as () => { name: string, class: string; label:'' ; action: Function}[],
  }, 
});
props
// Maneja el evento de clic en los botones de la tabla
const handleButtonClick = (action, item) => {
  action(item); // Ejecuta la acción correspondiente al botón con los datos del ítem
};
</script>
