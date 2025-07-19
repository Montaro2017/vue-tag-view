<template>
  <div class="h-100%">
    <div v-for="i in size"> {{ i }}</div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const size = ref(100)

</script>

<style scoped>

</style>