<template>
<!--  <StartWindow/>-->
  <el-button
      v-if="!isChooseOfModelType"
      type="success"
      plain
      @click="choosingTheModelForm">Create the first Model
  </el-button>
  <div v-if="isChooseOfModelType">
    Choose the model type:
    <el-table
        :data="listTypeOfModels"
        highlight-current-row
        style="width: 100%"
        @current-change="onRowChange">
      <el-table-column prop="name" width="120" />
    </el-table>
    <el-input
        v-if="modelType != null"
        v-model="nameModel"
        placeholder="Name your model">
    </el-input>
    <el-button
        v-if="modelType != null"
        @click="handleCreate">
      Create a Model
    </el-button>
  </div>

</template>

<script>
import StartWindow from "@/components/StartWindow";
import axios from "axios";
import { ref, onMounted } from "vue";
import router from "@/router";
import listModels from "@/views/pages/ListModels";



export default {
  name: "ChoseModelBeforeCreating",
  components: {
    StartWindow
  },
  setup() {
    const listTypeOfModels = ref([])
    const modelType = ref(null)
    const isChooseOfModelType = ref(false)
    const nameModel = ref(null)

    onMounted(async () => {
      let response = await axios.get('/CrudModel/types');
      listTypeOfModels.value = response.data;
    })

    const handleCreate = async () => {
      const date = new Date(Date.now());
      let response = await axios.post('/CrudModel', {
        "name": nameModel.value,
        "modelType": modelType.value.id,
        "modelStatus": 0,
        "parameters": {
          "startDate": date.toISOString()
        }
      });
      if (response.status == 200){
        await router.push({name: 'ListModels'})
      }
      console.log(response)
    }
    const onRowChange = (value) => {
      modelType.value = value;
      console.log(modelType.value)
    }
    const choosingTheModelForm = () => {
      isChooseOfModelType.value = true
    }

    return {
      modelType,
      listTypeOfModels,
      onRowChange,
      isChooseOfModelType,
      choosingTheModelForm,
      nameModel,
      handleCreate
    }
  }
}

</script>