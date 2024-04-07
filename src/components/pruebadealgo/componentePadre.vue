<template>
  <table>
    <thead>
      <tr>
        <th>UserName</th>
        <th>Credential Name</th>
        <!-- Otras columnas según tus datos -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="(user, index) in groupedData" :key="index">
        <!-- <td>{{ user.UserName }}</td> -->
        <td>{{ user.iam_user_name }}</td>
        <!-- Otras celdas según tus datos -->
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usedataStore } from '../../store/datoUsuario';

import { secretUserIAM } from '../../types'; // Importa la interfaz SecretUserIAM


const dataStore = usedataStore()

// Propiedad computada para obtener los datos de secretUserIAM desde el store
const secretUserIAM = computed(() => dataStore.dataSecretIAM);

// Función para agrupar los datos de acuerdo con el campo UserName
const groupDataByUserName = () => {
  const groupedData: secretUserIAM[] = [];

  secretUserIAM.value.forEach((item: secretUserIAM) => {
    const existingUser = groupedData.find(user => user.iam_user_name === item.iam_user_name);
    if (existingUser) {
      existingUser.iam_user_name.push(item.iam_user_name);
      // Agrega otros campos según tu interfaz SecretUserIAM
    } else {
      groupedData.push({
        UserName: item.iam_user_name,
        CredentialName: [item.iam_user_name],
        // Agrega otros campos según tu interfaz SecretUserIAM
      });
    }
  });

  return groupedData;
};

// Propiedad computada para obtener los datos agrupados por UserName
const groupedData = computed(groupDataByUserName);
</script>
