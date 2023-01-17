<template>
<!--  <StartWindow/>-->
  <el-container>
    <el-header style="text-align: left; font-size: 15px">
      <el-button>
        <el-icon style="margin-right: 8px; margin-top: 1px;"><Back /></el-icon>
        <span>
        Back
        </span>
      </el-button>
    </el-header>
    <el-main>
      <div v-if="isModelsExist">
        <el-table
            :data="listOfModels"
            highlight-current-row
            style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column label="Name" prop="name" width="120" />
          <el-table-column label="Status" prop="modelStatus" width="150" />
          <el-table-column label="Typ" prop="modelType" width="120" />
          <el-table-column label="Operations" width="200" >
            <template #default="scope">
              <el-button
                  size="small"
                  type="primary"
                  @click="handleView(scope.$index, scope.row)">
                View
              </el-button>
              <el-button
                  size="small"
                  type="danger"
                  @click="">
                Delete Model
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <div v-if="!isChooseOfModelType">
          You don`t have any model at now!
          <el-button
              type="success"
              plain
              @click="choosingTheModelForm">Create the first Model
          </el-button>
        </div>
        <div v-else>
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
      </div>
    </el-main>
    <el-footer>
      <el-button
          @click="handleCreate">
        Create model
      </el-button>
    </el-footer>
  </el-container>
</template>
<script>

import StartWindow from "@/components/StartWindow";
import axios from "axios";
import { ref, onMounted } from "vue";
import router from "@/router";

export default {
  name: "StartPage",
  components: {
    StartWindow
  },
  setup() {
    const listTypeOfModels = ref([]);
    const modelType = ref(null);
    const isChooseOfModelType = ref(false);
    const isModelsExist = ref(false);
    const nameModel = ref(null);
    const listOfModels = ref([])
    let isModelView = ref(false)
    let modelInfo = ref ();

    const handleView = async (index, model) => {
      let response = await axios.get('/BaseModelService/' + model.id);
      if (response.status == 200){
        isModelView = true
        modelInfo.value = response.data
        await router.push({name:"Models", params:{
            id: model.id
          }})
      }
    };

    onMounted(async () => {
      listTypeOfModels.value = (await axios.get('/BaseModelService/types')).data;

      let currentModels = await  axios.get('/BaseModelService');
      if (currentModels.data.length > 0){
        isModelsExist.value = true;
        listOfModels.value = currentModels.data;
      }
    })

    const handleCreate = async () => {
      const date = new Date(Date.now());
      let response = await axios.post('/BaseModelService', {
        "name": nameModel.value,
        "modelType": modelType.value.id,
        "modelStatus": 0,
        "parameters": {
          "startDate": date.toISOString()
        }
      });
      if (response.status == 200){
        await router.push({name: 'Models'})
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
      isModelsExist,
      choosingTheModelForm,
      nameModel,
      handleCreate,
      listOfModels,
      handleView,
      isModelView
    }
  }
}

</script>