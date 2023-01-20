<template>
  <base-model-form v-bind:model-info="modelInfo" v-bind:types="types"/>
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

    onMounted(async () => {
      let modelId = router.currentRoute.value.params.id;
      types.value = (await axios.get('/BaseModelService/types')).data;
      let response = await axios.get('/BaseModelService/' + modelId);
      if (response.status === 200){
        modelInfo.value = response.data
      }
      name.value = modelInfo.value.name;
    });

    return{
      modelInfo,
      types,
      name
    }
  }
}

</script>

<style scoped>

</style>