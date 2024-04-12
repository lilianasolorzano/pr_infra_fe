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
    <div class="modal-content">
      <v-dialog v-model="dialog" max-width="600px" class="modal">
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

              <div>
                <v-select title="" id="UserRol" :items="['ADMIN', 'INVITADO']" v-model="selectedOption"
                  style="width: 550px;" />
              </div>

            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="mostrarMensajeTempral">
              <v-btn :stop-event="true" @click="CreateUserLo">Guardar</v-btn>
            </v-btn>
            <v-btn @click="dialog = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
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
dataStore.id_user
const userId = dataStore.id_user
console.log('id de usuario local', userId)




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


</script>




<style>
.styleBUser {
  background-color: #145474;
  font-size: 13px;
  color: white;
  border-radius: 10px;
  height: 40px;
  width: 140px;
  text-decoration: none;
  position: relative;
  margin-left: 5%;
  margin-top: 50px;
}

.textUser {
  display: flex;
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

/* estilo de ventana modal  */

.modal {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(20, 84, 116, 0.2);
}

/* Estilos del contenido de la modal */
.modal-content {
  align-items: center;
  /* background-color: #fefefe; */
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 700px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Sombra */
}

/* Estilos del botón para cerrar la modal */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.input-select {
  width: 550px;
  height: 55px;
  padding: 8px;
  margin-bottom: 25px;
  margin-top: 3px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  font-size: 16px;
}

.input-select option {
  background-color: #fff;
  color: #145474;
}
</style>