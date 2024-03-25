<template>
    <table>
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">{{ column.label }}</th>
          <th>accion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index" >
          <td v-for="(column, columnIndex) in columns" :key="columnIndex">{{ item[column.key] }}</td>
          <td>
            <div>
            <!-- <globalBtn v-for="(dato, index) in buttons" :key="index" :btn_global="dato.name" :nameBtn="buttons" :buttonClass="dato.class"
            :onClick="dato.onClick" @click="handleButtonClick(item.id)" /> -->
            <!-- <globalBtn v-for="(dato, index) in buttons" :key="index" :btn_global="dato.name" :nameBtn="buttons" :buttonClass="dato.class"
              @click="handleButtonClick(item.id)" /> -->

              <!-- <router-link to="/Edit"> -->
              <globalBtn v-if="showButtonEditar" btn_global="editar"  @Click="handleButtonEdit(item.id)"/>
              <!-- </router-link> -->
              <globalBtn v-if="showButtonEliminar" btn_global="eliminar" @click="handleButtonDelete(item.id) " />
              <globalBtn v-if="showButtonVisualize" btn_global="otro" @click="handleButtonVisualize(item.id)"/>
            </div>
          </td>
    
        </tr>
      </tbody>
    </table>
</template>
  
<script setup lang="ts">
  import { defineProps, ref} from 'vue';
  import {globalBtn} from '../importFile';
  import { IdUsuario } from '../types/index';
import router from '../router/router';

//   const props = defineProps<{
    
//   NameBtn: string
//   botonLabel: {
//     type:string,
//     required: false },

//   label: {type:string, required: false}
//   columns: { 
//     label: string; 
//     key: string;
//   }[],
//   data: Record<string, any>[]; 
//   buttons: { id:number; name: string; class: string; onClick: () => void | number | Function }[];
//   datos: Record<string, any>[], 
//   onClick: () => void;
// }>();



const props = defineProps({
  showButtonEditar: Boolean,
  showButtonEliminar: Boolean,
  showButtonVisualize: Boolean,
  botonLabel: {
    type:String,
    required: false
  },   
  // columns: { 
  // label: String,
  // key: String,
  // },
  columns: Array as () => {label:string, key:string} [],
  data: Array as () => Record<string, any>[],
  // buttons: Array as () =>{ id:number; name: string; class: string}[],
  // buttons: Array as () =>{ id:number; name: string; class: string; onClick: () => void | number | Function }[],
  // NameBtn: Array as () =>{name:string, class:string}[],
  NameBtn: Array as () => {name:string, class: string;}[],


    // datos: Record<string, any>[], 
    // onClick: () => void;
  });
  props

// const idUsers = ref<IdUsuario[]>([])
// Función para manejar el clic en el botón de editar
const emit = defineEmits()
const handleButtonEdit = (Idusers : string | number) => {
    const confirmacion = confirm(`¿Estás seguro de editar al usuario con ID ${Idusers}?`);
  if (confirmacion) {
    emit('editUser', Idusers);
    console.log(`Usuario con ID ${Idusers} editado`);
    // const user = idUsers.value.find(user => user.id === Idusers)
  }
  
  if (Idusers) {
    router.push({
      name: 'editar',
      params: {
        id: Idusers, 
      }
    })
    console.log('id',Idusers)

} else {
  console.error('Usuario no encontrado');
}
};
  
  // Función para manejar el clic en el botón de eliminar
  const handleButtonDelete = (Idusers: string | number ) => {
      const confirmacion = confirm(`¿Estás seguro de eliminar al usuario con ID ${Idusers}?`);
    if (confirmacion) {
      emit('deleteUser', Idusers);
      console.log(`Usuario con ID ${Idusers} eliminado`);
    }};
  
// Función para manejar el clic en el botón de eliminar
const handleButtonVisualize = (Idusers: string | number ) => {
    const confirmacion = confirm(`¿Estás seguro de visualizar al usuario con ID ${Idusers}?`);
  if (confirmacion) {
    emit('visualizeUser', Idusers);
    console.log(`Usuario con ID ${Idusers} visualizado`);
  }};



</script>
  
<style scoped>

  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
</style>
  