<template>
  <!-- componer el alert  -->
  <v-alert v-show="mostrarMensaje" type="success" dismissible class="fade-out-message">
    {{ mensaje }}
  </v-alert>

  <v-alert v-show="mostrarMensajeDel" type="error" dismissible class="fade-out-message">
    {{ mensajeDel }}
  </v-alert>

  <h1 class="textUser">Usuarios</h1>
  <global-btn btn_global="Agregar usuario" buttonClass="styleBUser" dark @click="dialog = true" />
  <div>
    <tablegbl :columns="columns" :data="dataTable" :showButtonEditar="true" :showButtonEliminar="true"
      @deleteUser="handleDeleteJSON" @editUser="handleEdit" class="padding" />
  </div>

  <!-- Ventana modal -->
  <form @submit.prevent="AddnewUser">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>Agregar Nueva Usuario</v-card-title>
        <v-card-text>
          <div>
            <input-global title="" type="text" id="UserName" v-model="UsuarioAgr.user"
              @update:value="newValue => updateI('user', newValue)" name="nombre de usuario" />
          </div>
          <div>
            <input-global title="" type="email" id="UserEmail" v-model="UsuarioAgr.email"
              @update:value="newValue => updateI('email', newValue)" name="email" />
          </div>
          <div>
            <input-global title="" type="password" id="password" v-model="UsuarioAgr.password"
              @update:value="newValue => updateI('password', newValue)" name="password" />
          </div>
          <div>
            <!-- <UserRol type="text" id="UserRol" v-model="UsuarioAgr.role" /> -->
            <v-select title="" id="UserRol" :items="['admin', 'invitado']" v-model="selectedOption" />
          </div>
        </v-card-text>
        <v-card-actions>
          <!-- <div @click="showAlertAgrUserExit"> -->
          <v-btn color="primary" @click="mostrarMensajeTempral">
            <global-btn btn_global="Regitrar" :stop-event="true" @click="CreateUserLo" />
          </v-btn>
          <!-- </div> -->
          <!-- <v-btn color="primary" @click="agregarCredencial">Guardar</v-btn> -->
          <v-btn @click="dialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </form>
  <!-- boton de alerta  -->
  <!-- <button @click="showAlert">Hello world</button> -->
</template>


<script setup lang="ts">
import { tablegbl } from '../../importFile';
import { globalBtn } from '../../importFile';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
// import * as amplifyconfig from '../../amplifyconfiguration.json';
import { amplifyConfig } from '../../importFile'
import { IdUsuario } from '../../types/index';
import { computed, onMounted, ref } from 'vue';
import { usedataStore } from '../../store/datoUsuario';
import router from '../../router/router';
import { inputGlobal } from '../../importFile';




Amplify.configure(amplifyConfig);
const dataStore = usedataStore()

const idUsers = ref<IdUsuario[]>([])
// llamar la API   
async function getUsers() {
  try {
    const getUserTable = await API.get({
      apiName: 'access_API',
      path: `/dev/users/findAll`,
      options: {
        body: { menssage: 'ingresado' }
      }
    });
    const { body } = await getUserTable.response;
    const data = await body?.json();
    console.log('appi', data);

    if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      idUsers.value = data.data as unknown as IdUsuario[];
      dataStore.clearUserIds();

      idUsers.value.forEach((dataStoreJson) => {
        dataStore.userJson(
          dataStoreJson.id as (string),
          dataStoreJson.user as (string),
          dataStoreJson.email as (string),
          dataStoreJson.password as (string),
          dataStoreJson.role as (string),
        )

      });
    } else {
      idUsers.value = []
    }
  } catch (error) {
    console.log('sin obtener datos', error);
    console.log('sin obtener datos')

  } finally {

  }
};
onMounted(getUsers);
// dataStore.clearUserIds()

const columns = [
  { label: 'Id', key: 'id' },
  { label: 'Usuario', key: 'user' },
  { label: 'Correo', key: 'email' },
  { label: 'Rol', key: 'role' },
];

const dataTable = computed(() => dataStore.dataUsers);


// editar usuario 
const handleEdit = (id: string) => {
  const user = idUsers.value.find(user => user.id === id)

  if (id) {
    router.push({
      name: 'editar',
      params: {
        id: user?.id
      }
    })

  } else {
    console.error('Usuario no encontrado');
  }

}


// mensaje de accion Usuario eliminado
const mensajeDel = ref('')
const mostrarMensajeDel = ref<boolean>(false);
const mostrarMensajeTempralDel = () => {
  mostrarMensajeDel.value = true;
  setTimeout(() => {
    mostrarMensajeDel.value = true;
  }, 5000);
}

// eliminacion de usuario 
const handleDeleteJSON = async (Idusers: string | number) => {
  try {
    const restOperation = await API.del({
      apiName: "access_API",
      path: `/dev/users/delete/${Idusers}`,
    });
    await restOperation.response
    mensajeDel.value = 'Usuario eliminado';

    idUsers.value = idUsers.value.filter((row) => row.id !== Idusers)
    dataStore.clearUserIds();

    idUsers.value.forEach((getUser) => {
      dataStore.userGet(
        getUser.id as string,
        getUser.user as string,
        getUser.email as string,
        getUser.password as string,
        getUser.role as string,
      )
      mostrarMensajeTempralDel()
    })
    console.log('user deleted successfully:', Idusers);
  } catch (error) {
    console.log('delete call failed: ', error);
  }
};

// mensaje de usuario agregado
// function showAlertAgrUserExit() {
//   Swal.fire({
//     html: '<div style="width: 100%; height: 200px;">El usuario ha sido agregado de manera exitosa</div>',
//     // text: "El usuario ha sido agregado de manera exitosa",
//     position: "top",
//     imageHeight: 100,
//     icon: "success",
//     showConfirmButton: false,
//     timer: 1500,
//     // customClass: {
//     //   container: 'custom-swal-container'
//     // }
//   });
// }



// mensaje de accion Usuario registrado
const mensaje = ref('');
const mostrarMensaje = ref<boolean>(false);
const mostrarMensajeTempral = () => {
  mostrarMensaje.value = true;
  setTimeout(() => {
    mostrarMensaje.value = true;
  }, 5000); // Ocultar el mensaje después de 3 segundos (3000 milisegundos)
}

// ventana modal de agregar usuario IAM 
const dialog = ref(false);
const selectedOption = ref('select...');
const UsuarioAgr = ref<IdUsuario>({
  id: '',
  user: '',
  email: '',
  password: '',
  role: '',
});

const createUser = async () => {
  try {
    await API.post({
      apiName: 'access_API',
      path: '/dev/users/create',
      options: {
        body: {
          user: UsuarioAgr.value.user as string,
          email: UsuarioAgr.value.email as string,
          password: UsuarioAgr.value.password as string,
          role: selectedOption.value
        }
      }
    });
    console.log('Usuario agregado');
    mensaje.value = 'Usuario agregado exitosamente';
    dialog.value = false;
    dataStore.clearUserIds()

  } catch (error) {
    console.log('create call failed: ', error);

  } finally {

  }
};
const updateI = (fielName: string, value: string) => {
  UsuarioAgr.value = { ...UsuarioAgr.value, [fielName]: value }
  console.log('datos agregados', UsuarioAgr.value)
}

const CreateUserLo = async (fielName: string, value: string) => {
  updateI(fielName, value)
  await createUser()
  router.push('/Users')
}

// enviar los datos del formulario a mi store 
function AddnewUser() {
  dataStore.saveData({
    user: UsuarioAgr.value.user,
    email: UsuarioAgr.value.email,
    password: UsuarioAgr.value.password,
    role: UsuarioAgr.value.role,
  })
  console.log(UsuarioAgr.value.user || '')
  // console.log(UsuarioAgr.value.user)  
  console.log(UsuarioAgr.value.email)
  console.log(UsuarioAgr.value.password)
  console.log(UsuarioAgr.value.role)
};


// Llama a la función para ocultar el mensaje después de que el componente se monte
// onMounted(ocultarMensaje);
</script>




<style>
.styleBUser {
  background-color: #145474;
  font-size: 13px;
  /* text-decoration: underline; */
  color: white;
  /* border: 2px solid black; */
  border-radius: 10px;
  height: 40px;
  width: 140px;
  text-decoration: none;
  /* padding: 10px;
  padding-bottom: 10px; */
  position: relative;
  margin-left: 5%;
  margin-top: 50px;
}

.textUser {
  /* background-image: url("../../../public/img/istockphoto-1130707008-612x612.jpg"); */
  /* background-size: cover;
  background-clip: text; */
  /* -webkit-background-clip: text; */
  display: flex;
  /* color: white; */
  margin-left: 5%;
  margin-top: 40px;
}

.fade-out-message {
  animation: fadeOut 3s ease forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>