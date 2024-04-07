<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="(column, index) in columns" :key="index">{{ column.label }}</th>
        <th>accion</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td v-for="(column, columnIndex) in columns" :key="columnIndex">{{ item[column.key] }}</td>
        <td>

          <globalBtn buttonClass="BtnEditar" v-if="showButtonEditar" btn_global="Editar"
            @Click="handleButtonEdit(item.id)" />
          <globalBtn buttonClass="BtnEliminar" v-if="showButtonEliminar" btn_global="Eliminar"
            @click="handleButtonDelete(item.id)" />
          <!-- Botones de usuario IAM  -->
          <globalBtn buttonClass="BtnEliminar" v-if="showButtonEliminarIAM" btn_global="Eliminar"
            @click="handleButtonDeleteIAM(item.UserName)" />
          <globalBtn buttonClass="BtnVisualizar" v-if="showButtonVisualize" btn_global="Visualizar"
            @click="handleButtonVisualize(item.UserName)" />

        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { globalBtn } from '../importFile';
import router from '../router/router';

const emit = defineEmits()
const props = defineProps({
  showButtonEditar: Boolean,
  showButtonEliminar: Boolean,
  showButtonVisualize: Boolean,
  showButtonEliminarIAM: Boolean,
  botonLabel: {
    type: String,
    required: false
  },
  columns: Array as () => { label: string, key: string }[],
  data: Array as () => Record<string, any>[] | undefined,
  NameBtn: Array as () => { name: string, class: string; }[],
});
props

// Función para manejar el clic en el botón de editar
const handleButtonEdit = (id: string | number) => {
  const confirmacion = confirm(`¿Estás seguro de editar al usuario con ID ${id}?`);
  if (confirmacion) {
    emit('editUser', id);
    console.log(`Usuario con ID ${id} editado`);
    // const user = idUsers.value.find(user => user.id === Idusers)
  }

  if (id) {
    router.push({
      name: 'editar',
      params: {
        id: id,
      }
    })
    console.log('id', id)

  } else {
    console.error('Usuario no encontrado');
  }
};

// Función para manejar el clic en el botón de eliminar
const handleButtonDelete = (Idusers: string | number) => {
  const confirmacion = confirm(`¿Estás seguro de eliminar al usuario con ID ${Idusers}?`);
  if (confirmacion) {
    emit('deleteUser', Idusers);
    console.log(`Usuario con ID ${Idusers} eliminado`);
  }
};

// Función para manejar el clic en el botón de visualizar, hay que checar si se crearia varios del mismo, se utilizaria varias

const handleButtonVisualize = (UserName: string | number) => {
  const confirmacion = confirm(`¿Estás seguro de visualizar al usuario con ID ${UserName}?`);
  if (confirmacion) {
    emit('visualizeCredUser', UserName);
    console.log(`Usuario con ID ${UserName} visualizado`);
  }
  if (UserName) {
    router.push({
      // cambiar el name por el de visualizar ya que padre es solo una practica
      name: 'visualizeCredIAM',
      params: {
        UserName: UserName,
      }
    })
    // console.log('id', handleButtonVisualize)

  } else {
    console.error('Usuario no encontrado');
  }

};

const handleButtonDeleteIAM = (UserName: string | number) => {
  const confirmacion = confirm(`¿Estás seguro de Eliminar al usuario ${UserName}?`);
  if (confirmacion) {
    emit('deleteIAM', UserName);
    console.log(`Usuario  ${UserName} Eliminado`);
  }
};


</script>

<style>
table {
  background-color: white;
  /* background-color: #333; */
  box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.2);
  /* border-radius: 5px; */
}

table:hover {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.9);
}

.table {
  text-transform: none;
  width: 90%;
  border-collapse: collapse;
  font-family: Arial;
  margin-top: 1%;
  margin-bottom: 5%;
  margin-left: 5%;
  margin-right: 5%;
  /* justify-content: center; */
  /* align-items: center; */

}

th,
td {
  border: 1px solid #ddd;
  padding: 6px;
  text-align: left;
}

.BtnEditar {
  width: auto;
  height: auto;
  background-color: hsl(105, 96%, 79%,
      0.9);
  /* margin: 5px; */
}

.BtnEliminar {
  width: auto;
  height: auto;
  background-color: hsl(354, 82%, 60%, 0.9);
  /* margin: 5px; */
}

.BtnVisualizar {
  width: auto;
  height: auto;
  background-color: hsl(214, 67%, 72%, 0.9);
  /* margin: 5px; */
}
</style>