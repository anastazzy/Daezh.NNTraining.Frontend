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
          <el-table-column label="Name" prop="name" width="150" />
          <el-table-column label="Type" prop="typeName" width="250" />
          <el-table-column label="Status" prop="statusName" width="250" />
          <el-table-column label="Fast Operations" width="200" >
            <template #default="scope">
              <el-button
                  size="small"
                  type="warning"
                  plain
                  @click="handleView(scope.$index, scope.row)">
                View
              </el-button>
              <el-button
                  size="small"
                  type="danger"
                  plain
                  @click="handleDelete(scope.row.id)">
                Delete Model
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="" width="200" >
            <template #default="scope">
              <div v-if="scope.row.statusId === 3"
                   v-loading="loading"
                   element-loading-text="Process of training..."
                   element-loading-background="rgba(122, 122, 122, 0.8)">
                process...
              </div>
              <div v-else>
                <el-button
                    size="small"
                    type="success"
                    plain
                    @click="trainModel(scope.row.id)"
                    v-if="scope.row.statusId === 2">
                  Train model
                </el-button>
              </div>
              <div v-if="scope.row.statusId === 4">
done
<!--                сделать кнопку типо попробовать-->
<!--                модальное окно, куда помещаешь параметр, который надо предсказать (динамически в зависимости от типа моделм)-->
              </div>
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
              @click="choosingTheModelForm"
          >Create the first Model
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
import modelHub from "@/ws/modelHub";

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
    const listOfModels = ref([]);
    let isModelView = ref(false);
    let modelInfo = ref ();
    const loading = ref(false)
    const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `

    const handleView = async (index, model) => {
      let response = await axios.get('/BaseModelService/' + model.id);
      if (response.status === 200){
        isModelView = true
        modelInfo.value = response.data
        await router.push({
          name: "model",
          params:{
            id: model.id
          }})
      }
    };

    const trainModel = async (modelId) => {
      await axios.post('/ModelInteraction/train/' + modelId);
    };

    onMounted(async () => {
      await initModelsAsync();

      modelHub.on("getLoadingElement", async (statusId, modelId) => {
        let currentModel = listOfModels.value.find(x => x.id === modelId);
        currentModel.statusId = statusId;
        console.log(statusId)
      })
    })

    const handleDeleteAsync = async (modelId) => {
      await axios.delete('/BaseModelService/' + modelId);
      await initModelsAsync();
    }

    const initModelsAsync = async () => {
      listTypeOfModels.value = (await axios.get('/BaseModelService/types')).data;

      let currentModels = await  axios.get('/BaseModelService');
      if (currentModels.data.length > 0) {
        isModelsExist.value = true;
        listOfModels.value = currentModels.data;
      }
    }

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
      if (response.status === 200){
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
      trainModel,
      handleDelete: handleDeleteAsync,
      isModelView,
      loading,
      svg
    }
  }
}

</script>