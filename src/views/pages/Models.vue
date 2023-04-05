<template>
  <!--  <StartWindow/>-->
  <el-container>
<!--    <el-header style="text-align: left; font-size: 15px">-->
<!--      <el-button>-->
<!--        <el-icon style="margin-right: 8px; margin-top: 1px;"><Back /></el-icon>-->
<!--        <span>-->
<!--        Back-->
<!--        </span>-->
<!--      </el-button>-->
<!--    </el-header>-->
    <el-main>
      <div v-if="isModelsExist">
        <el-table
            v-if="!isCreation"
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
                  @click="handleDeleteAsync(scope.row.id)">
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
                    type="info"
                    plain
                    @click="trainModel(scope.row.id)"
                    v-if="scope.row.statusId === 2">
                  Train model
                </el-button>
              </div>
              <div v-if="scope.row.statusId === 4">
                done
                <el-button
                    size="small"
                    type="success"
                    plain
                    @click="openPredictPage(scope.row.id)">
                  Use model
                </el-button>
                <!--                сделать кнопку типо попробовать-->
                <!--                модальное окно, куда помещаешь параметр, который надо предсказать (динамически в зависимости от типа моделм)-->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        У вас нет ни одной модели! Скорее попробуйте ее создать!
      </div>
      <el-dialog v-model="dialogFormVisible" title="Creation model" append-to-body>
        <el-form :model="creationForm">
          <el-form-item label="Named your model">
            <el-input v-model="creationForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Chose the model type">
            <el-select v-model="creationForm.modelType" placeholder="Please select a model type">
              <el-option v-for="type in listTypeOfModels"
                         :key="type.id"
                         :label="type.name"
                         :value="type.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleCreate(creationForm)">
          Confirm
        </el-button>
      </span>
        </template>
      </el-dialog>
      <el-dialog v-model="modelToPredict" title="Filling the parameters fo prediction" append-to-body>
        <component
            v-if = "modelToPredict"
            :is = "dynamicComponentPredictForm"
        >
        </component>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="modelToPredict = null">Cancel</el-button>
        <el-button type="primary" @click="">
          Predict
        </el-button>
      </span>
        </template>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-button text @click="dialogFormVisible = true">
        Create model
      </el-button>
    </el-footer>
  </el-container>
</template>
<script>

import axios from "axios";
import {ref, onMounted, h, computed} from "vue";
import router from "@/router";
import modelHub from "@/ws/modelHub";
import {reactive} from "vue";
import {ElForm, ElMessage, ElMessageBox} from "element-plus";
import DataPredictionPredictForm from "@/components/PredictForms/DataPredictionPredictForm";

export default {
  name: "Models",
  components: {
    DataPredictionPredictForm,
  },
  setup() {
    const listTypeOfModels = ref([]);
    const modelType = ref(null);
    const isChooseOfModelType = ref(false);
    const isModelsExist = ref(false);
    const isCreation = ref(false);
    const nameModel = ref(null);
    const listOfModels = ref([]);
    let isModelView = ref(false);
    const dialogFormVisible = ref(false);
    let modelInfo = ref ();
    const statuses = ref ();
    const modelToPredict = ref (null);
    const loading = ref(false);
    const isTrainedModel = ref(false);
    const creationForm = reactive({
      name: '',
      modelType: 0,
    })

    onMounted(async () => {
      await initModelsAsync();

      statuses.value = (await axios.get('/BaseModelService/statuses')).data;

      modelHub.on("getLoadingElement", async (statusId, modelId) => {
        let currentModel = listOfModels.value.find(x => x.id === modelId);
        currentModel.statusId = statusId;
        console.log(statusId)
      });
    })

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

    const dynamicComponentPredictForm = computed(() => {
      let currentModel = listOfModels.value.find(x => x.id === modelToPredict.value);
      if (currentModel){
        switch (currentModel.typeName){
          case listTypeOfModels.value[0].name:
            return 'data-prediction-predict-form'
          default:
            break
        }
      }
    })

    function getKeyByValue(object, targetName) {
      let arrayStatusNames = Array.from(object, (object) => {return object.name});
      return Object.keys(arrayStatusNames).find( key => arrayStatusNames[key] === targetName);
    }

    const trainModel = async (modelId) => {
      await axios.post('/ModelInteraction/train/' + modelId);
    };

    const openPredictPage = async (modelId) => {
      modelToPredict.value = modelId;
      // await axios.post('/ModelInteraction/predict/' + modelId);
    };

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

    const handleCreate = async (creationForm) => {
      const date = new Date(Date.now());
      let response = await axios.post('/BaseModelService', {
        "name": creationForm.name,
        "modelType": creationForm.modelType,
        "modelStatus": 0,
        "parameters": {
          "startDate": date.toISOString()
        }
      });
      dialogFormVisible.value = false;
      await initModelsAsync();
    }

    const onRowChange = (value) => {
      modelType.value = value;
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
      handleDeleteAsync,
      isModelView,
      loading,
      isCreation,
      creationForm,
      dialogFormVisible,
      isTrainedModel,
      openPredictPage,
      modelToPredict,
      getKeyByValue,
      statuses,
      dynamicComponentPredictForm
    }
  }
}

</script>