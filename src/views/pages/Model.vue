<template>
  <base-model-form
      v-if="modelInfo"
      v-bind:model-info="modelInfo"
      v-bind:types="types"
      v-on:submit-upload-of-file="receiveMessage"
  />
</template>

<script>
import BaseModelForm from "@/components/BaseModelForm";
import { ref, onMounted } from "vue";
import axios from "axios";
import router from "@/router";

export default {
  name: "Model",
  components: {
    BaseModelForm
  },
  setup(){
    const types = ref([]);
    const modelInfo = ref();
    const name = ref();
    const index = ref(0);
    let modelId = router.currentRoute.value.params.id;

    onMounted(async () => {
      types.value = (await axios.get('/BaseModelService/types')).data;
      let response = await axios.get('/BaseModelService/' + modelId);
      if (response.status === 200){
        modelInfo.value = response.data
      }
      name.value = modelInfo.value.name;
    });

    const receiveMessage = async function (){
      let response = await axios.get('/BaseModelService/' + modelId);
      if (response.status === 200){
        modelInfo.value = response.data
      }
    }

    return{
      receiveMessage,
      modelInfo,
      types,
      name,
      index
    }
  }
}

</script>

<style scoped>

</style>