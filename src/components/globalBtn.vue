<template>
    <v-btn @click="onClick">
        <button @click="handleClick" :class="buttonClass">{{ btn_global}}</button>
    </v-btn>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    btn_global:String,
    stopEvent:{
        type:[Boolean, String],
        default: false,
    },
    buttonClass: String,
    onClikBtn: () => void [Number, Function]
});

// const handleClick = ref <HTMLFormElement | null>(null)
const handleClick = () => {
    props.onClikBtn;
};
const emit = defineEmits()
console.log(handleClick)

emit( 'cambiar nombre','nuevo nombre del boton')
const onClick = () =>{
    if(props.stopEvent){
        console.log('eventonclick');
        // handleClick.value?.login
    }else{
        console.log('eventonclick no');
        // myform.value?.submit();
    }
};

</script>

<style scoped>
.btn_agr{
  align-content: center;
  background-color: blue;
  color: white;
}

</style>