<template>
<div>
    <h1>tal vez no lo utilice asi que hay que checar para eliminarlo</h1>
    <v-responsive max-width="500px" >
        <v-text-field variante="outline" :rules="[rules.required]" @input="listenInput" v-model="inputValue">
            <label for="">{{ props.title }}</label>
        </v-text-field>

    </v-responsive>
</div>
</template>

<script lang="ts" setup>
import {defineProps, ref, defineEmits, watch} from 'vue'

const props = defineProps({
    title:{
        type:String,
        required: true
    }, 
    value:{
        type:[String, Number],
        required: false
    },
    Placeholder:{
        type:String,
        required: false
    }
})
const inputValue = ref(props.value)
const emit = defineEmits()
emit('update:value', inputValue)

const listenInput = (event: Event) =>{
    const newValue = (event.target as HTMLInputElement).value

    inputValue.value = newValue
    emit('update: value', newValue)
}
watch(
    ()=> props.value,
    (newValue)=>{
        inputValue.value = newValue
})

const rules = {
    required:value => !! value || 'campo requerido'
}

</script>

<style>


</style>