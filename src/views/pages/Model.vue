<template>
  <base-model-form v-bind:model-info="modelInfo" v-bind:name="name"/>
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
    const modelInfo = ref();
    const name = ref();

    onMounted(async () => {
      let modelId = router.currentRoute.value.params.id;
      let response = await axios.get('/BaseModelService/' + modelId);
      if (response.status === 200){
        modelInfo.value = response.data
      }
      name.value = modelInfo.value.name;
    });

    return{
      modelInfo,
      name
    }
  }
}

</script>

<style scoped>

</style>