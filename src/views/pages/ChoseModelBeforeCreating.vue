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
<!--      <el-table-column type="index" width="50" />-->
      <el-table-column prop="name" width="120" />
    </el-table>

    <template>
      <el-input v-model="input" placeholder="Please input" clearable />
    </template>

    <el-button v-if="modelType != null">Create a Model</el-button>
  </div>

</template>

<script>
import StartWindow from "@/components/StartWindow";
import axios from "axios";
import { ref, onMounted } from "vue";



export default {
  name: "ChoseModelBeforeCreating",
  components: {
    StartWindow
  },
  setup() {
    const listTypeOfModels = ref([])
    const modelType = ref(null)
    const isChooseOfModelType = ref(false)

    onMounted(async () => {
      let response = await axios.get('/CrudModel/types');
      listTypeOfModels.value = response.data;
    })

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
      choosingTheModelForm
    }
  }
}

</script>