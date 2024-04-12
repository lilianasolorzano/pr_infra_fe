<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">{{ column.label }}</th>
          <th>accion</th>
        </tr>
      </thead>
      <!-- <v-pagination :length="4"> -->
      <tbody>
        <!-- <tr v-for="(item, index) in data" :key="index"> -->
        <tr v-for="(item, index) in paginatedData" :key="index">
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
      <!-- </v-pagination> -->

      <tfoot>
        <tr>
          <td colspan="6">
            <select v-model="itemsPerPage" @change="handleItemsPerPageChange">
              <option :value="5" selected>5</option>
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="20">20</option>
            </select>

            <v-pagination v-model="currentPage" :total-visible="5" :per-page="itemsPerPage" @change="handlePagination"
              :length="totalPages" />
          </td>
        </tr>
      </tfoot>
      <div>Total páginas: {{ totalPages }}</div>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue';
// import { VPagination } from 'vuetify/lib/components/index.mjs';
import { globalBtn } from '../importFile';
import router from '../router/router';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'




const emit = defineEmits()
const props = defineProps({
  showButtonEditar: Boolean,
  showButtonEliminar: Boolean,
  showButtonVisualize: Boolean,
  showButtonEliminarIAM: Boolean,
  showButtonVisualizeUser: Boolean,
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
  emit('editUser', id);
  console.log(`Usuario con ID ${id} editado`);

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

  // function showAlertDelete() {
  Swal.fire({
    text: "¿Está seguro de eliminar al usuario?",
    // position: "top-end",
    position: "center",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
    // preConfirm: async
  }).then((result) => { // Usa el método `then` para manejar la respuesta del usuario
    if (result.isConfirmed) { // Si el usuario confirma la acción
      emit('deleteUser', Idusers);
      console.log(`Usuario con ID ${Idusers} eliminado`);
      // handleDeleteJSON;
      // console.log('usuario eliminado con exito')
      // Llama a la función para eliminar el usuario
    }
  });
  // }


};


// Función para manejar el clic en el botón de visualizar, hay que checar si se crearia varios del mismo, se utilizaria varias

const handleButtonVisualize = (UserName: string | number) => {
  emit('visualizeCredUser', UserName);
  console.log(`Usuario con ID ${UserName} visualizado`);
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
  Swal.fire({
    text: `¿Está seguro de eliminar al usuario  ${UserName}?`,
    // position: "top-end",
    position: "center",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
    // preConfirm: async
  }).then((result) => { // Usa el método `then` para manejar la respuesta del usuario
    if (result.isConfirmed) { // Si el usuario confirma la acción
      emit('deleteIAM', UserName);

      console.log(`Usuario  ${UserName} Eliminado`);
    }
  });
  // const confirmacion = confirm(`¿Estás seguro de Eliminar al usuario ${UserName}?`);
  // if (confirmacion) {
  //   emit('deleteIAM', UserName);
  //   console.log(`Usuario  ${UserName} Eliminado`);
  // }
};

// const data = ref(props.data);
const currentPage = ref(1);
const itemsPerPage = ref(5);

const totalItems = computed(() => props.data?.length ?? 0);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const paginatedData = computed(() => props.data?.slice(startIndex.value, startIndex.value + itemsPerPage.value));

const handleItemsPerPageChange = () => {
  currentPage.value = 1; // Resetea la página actual cuando se cambia el número de elementos por página
};

const handlePagination = (value: number) => {
  currentPage.value = value;
};

// Añadir un watcher para confirmar y actuar sobre cambios en itemsPerPage
watch(itemsPerPage, () => {
  currentPage.value = 1; // Asegúrate de que la página se reinicia también aquí
  // Puedes agregar más lógica si es necesario cuando esto cambia
}, { immediate: true });

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