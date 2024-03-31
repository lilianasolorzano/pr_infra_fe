<template>
   <H1>Credenciales</H1>
   <router-link to="/agregarCredencial">
      <global-btn btn_global="Agregar credencial" />
   </router-link>
   <router-link to="/credentialCreate">
      <global-btn btn_global="Crear credencial" buttonClass="" />
   </router-link>
   <div>
      <tablegbl :columns="columns" :data="dataTable" :showButtonEditar="false" :showButtonEliminar="false"
         :showButtonVisualize="true" :showButtonEliminarIAM="true" @deleteIAM="handleDeleteIAM"
         @visualizeUser="handleVisualizeIAM" />
   </div>
</template>

<script setup lang="ts">
import { usedataStore } from '../../store/datoUsuario';
import { computed, ref } from 'vue'
import { tablegbl } from '../../importFile';
import { globalBtn } from '../../importFile';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
import * as amplifyconfig from '../../amplifyconfiguration.json';
import { IduserIAM } from '../../types';


Amplify.configure(amplifyconfig)
const dataStore = usedataStore()
const usersIAM = ref<IduserIAM[]>([])

// obtencion de usuariosIAM desde JSON
async function getIAM() {
   try {
      const getUser = await API.get({
         apiName: 'access_API',
         path: '/dev/iam/findAll',
         options: {
            body: {
               message: 'ingresado',
            }
         }
      });
      const { body } = await getUser.response;
      const data = await body?.json();
      console.log('APPI', data);

      if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
         usersIAM.value = data.data as unknown as IduserIAM[];

         dataStore.clearUserIds();
         usersIAM.value.forEach((IAM) => {

            dataStore.userIAM(
               IAM.UserId as (string),
               IAM.UserName as (string),
               IAM.accessKeyId as (string),
               IAM.CreateDate as (string),
               IAM.Status as (string),
               IAM.ExpirationDate as (string),
            )

         });
      } else {
         usersIAM.value = []
      }
   } catch (error) {
      console.log('sin obtener datos', error);
      console.log('sin obtener datos')

   } finally {
   }
};
getIAM()


const columns = [
   { label: 'Usuario IAM', key: 'UserName' },
   { label: 'Id Usuario', key: 'UserId' },
   { label: 'Llave de acceso IAM', key: 'accessKeyId' },
   { label: 'Estado', key: 'Status' },
   { label: 'Fecha de expiracion', key: 'ExpirationDate' },
];

const dataTable = computed(() => dataStore.dataUsersIAM.slice(1));


async function handleDeleteIAM(UserName: string | number) {
   try {
      const restOperation = await API.del({
         apiName: "access_API",
         path: `/dev/iam/delete/${UserName}`,
      });
      console.log('restoperation', restOperation)
      await restOperation.response

      usersIAM.value = usersIAM.value.filter((row) => row.UserId !== UserName)
      console.log('iduser', usersIAM.value)

      // dataStore.clearUserIds();

      usersIAM.value.forEach((delUser) => {
         dataStore.userIAM(
            delUser.UserId as string,
            delUser.UserName as string,
            delUser.accessKeyId as string,
            delUser.CreateDate as string,
            delUser.Status as string,
            delUser.ExpirationDate as string,
         )

      })
      console.log('user deleted successfully:', UserName);
   } catch (error) {
      console.log('delete call failed: ', error);
   }
};
</script>

<style scoped></style>