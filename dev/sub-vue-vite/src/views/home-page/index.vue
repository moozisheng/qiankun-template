<script setup lang="ts">


  import { onMounted } from 'vue';
  import { init } from './init';

  onMounted(() => {

    console.log('onMounted');
    
    init()
})

</script>


<template>
  
</template>

<style scoped>

</style>
