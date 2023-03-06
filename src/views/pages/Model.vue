<template>
  <div v-if="modelInfo">
    <template v-if="!isNameEditing">
        <el-descriptions
            title="1 - Description of model"
            :column="3"
        >
          <el-descriptions-item label="Name">
            {{modelInfo.name}}
          </el-descriptions-item>
          <el-descriptions-item label="Type">
            {{modelInfo.typeName}}
          </el-descriptions-item>
          <el-descriptions-item label="Status">
            {{modelInfo.statusName}}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
            title="2 - Choose the train set"
            :column="2"
            v-if="this.getKeyByValue(this.statuses, this.modelInfo.statusName) !== 0"
        >
          <div v-if="selectedTrainSetName && files">
            <el-descriptions-item label="Choose from uploaded files:">
              <el-select v-if="selectedTrainSetName" v-model="selectedTrainSetName" class="m-2" placeholder="select">
                <el-option
                    v-for="item in files"
                    :key="item.fileNameInStorage"
                    :label="item.fileName"
                    :value="item.fileNameInStorage"
                />
              </el-select>
              <el-button type="primary" @click="handleSaveTrainSet">
                Save
              </el-button>
            </el-descriptions-item>
            <!--          TODO: Make form of uploading file as modal-->
            <el-descriptions-item label="Or upload new file:" class="el-row">
              <el-upload
                  ref="upload"
                  v-model:file-list="selectedFile"
                  class="upload-demo"
                  :action="'/api/BaseModelService/' + modelId + '/train-sets'"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :on-change="handleUploadBefore"
                  :on-success="handleSuccess"
                  :auto-upload="false"
                  name="trainSet"
              >
                <template #trigger>
                  <el-button type="primary">select file</el-button>
                </template>
                <el-button class="ml-3" type="success" @click="submitUpload">
                  add new file
                </el-button>
                <template #tip>
                  <div class="el-upload__tip text-red">
                    limit 1 file, new file will cover the old file
                  </div>
                </template>
              </el-upload>
            </el-descriptions-item>
          </div>
          <el-descriptions-item v-else>
            The model is needs in training dataset file
            <el-upload
                ref="upload"
                v-model:file-list="selectedFile"
                class="upload-demo"
                :action="'/api/BaseModelService/' + modelId + '/train-sets'"
                :limit="1"
                :on-exceed="handleExceed"
                :on-change="handleUploadBefore"
                :on-success="handleSuccess"
                :auto-upload="false"
                name="trainSet"
            >
              <template #trigger>
                <el-button type="primary">select file</el-button>
              </template>
              <el-button class="ml-3" type="success" @click="submitUpload">
                add new file
              </el-button>
              <template #tip>
                <div class="el-upload__tip text-red">
                  limit 1 file, new file will cover the old file
                </div>
              </template>
            </el-upload>
          </el-descriptions-item>
        </el-descriptions>
        <component
            v-if = "selectedTrainSetName"
            :is = "dynamicComponentParams"
            v-bind:parameters = "modelInfo.parameters"
        >
        </component>
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import router from "@/router";
import { ElNotification } from 'element-plus'
import DataPredictionParams from "@/components/Params/DataPredictionParams";
import {reactive} from 'vue'
import { h } from 'vue'
import { genFileId } from 'element-plus'

export default {
  name: "Model",
  components: {
    DataPredictionParams,
  },

  computed: {
    dynamicComponentParams: function () {
      if (this.getKeyByValue(this.statuses, this.modelInfo.statusName) > 0){
        switch (this.modelInfo.typeName){
          case this.types[0].name:
            return 'data-prediction-params'
          default:
            break
        }
      }
    },
  },

  setup(props, context){
    const upload = ref();
    const files = ref ([]);
    const selectedTrainSetName = ref("");
    const statuses = ref([]);
    const selectedFile = ref([]);
    const isNameEditing = ref(false);
    const ext = ".csv";
    const types = ref([]);
    const modelInfo = ref();
    const name = ref();
    const modelId = ref();
    const index = ref(0);
    const form = reactive({
      name: '',
    })

    onMounted(async () => {
      modelId.value = router.currentRoute.value.params.id;
      types.value = (await axios.get('/BaseModelService/types')).data;
      await settingTheModelInfo();

      name.value = modelInfo.value.name;
      statuses.value = (await axios.get('/BaseModelService/statuses')).data;
      files.value = (await axios.get('/BaseModelService/'+ modelId.value + '/train-sets')).data;

      if (files.value.length > 0){
        selectedTrainSetName.value = files.value
            .find(obj => obj.fileNameInStorage === modelInfo.value.parameters.nameOfTrainSet)
            .fileNameInStorage;
      }
    });

    const receiveMessage = async function (){
      let response = await axios.get('/BaseModelService/' + modelId);
      if (response.status === 200){
        modelInfo.value = response.data
      }
    }

    const settingTheModelInfo = async function (){
      let response = await axios.get('/BaseModelService/' + modelId.value);
      if (response.status === 200){
        modelInfo.value = response.data
      }
    }

    function getKeyByValue(object, targetName) {
      let arrayStatusNames = Array.from(object, (object) => {return object.name});
      return Object.keys(arrayStatusNames).find( key => arrayStatusNames[key] === targetName);
    }

    const handleSaveTrainSet = async (e) => {
      if (selectedTrainSetName){
        let response = await axios.patch('/BaseModelService/'+ modelId.value + '/train-sets',
            null,
            {params:{
                name: selectedTrainSetName.value
              }})
            .then(response => {
              console.log('bdhew')
              ElNotification({
                title: 'Info',
                message: h('i', { style: 'color: teal' }, 'Training set file is successfully edited'),
                type: 'info',
              });
              return response.status
            })
            .catch(err => console.warn(err));
      }
    }

    const getUrlForUploadFile = async (e) => {
      console.log(axios.getUri())
      return axios.getUri();
    }

    const handleExceed = (files) => {
      const file = files[0];
      upload.value.clearFiles();
      file.uid = genFileId();
      upload.value.handleStart(file)
    }

    const handleUploadBefore = (uploadFile, uploadFiles) => {
      if (!uploadFile.name.includes(ext)){
        ElNotification({
          title: 'Warning',
          message: h('i', { style: 'color: teal' }, 'Model training file is must be a .csv file'),
          type: 'warning',
        });
        upload.value.clearFiles();
        selectedFile.value = [];
      }
    }

    const handleSuccess = async (response) => {
      files.value = (await axios.get('/BaseModelService/'+ modelId.value + '/train-sets')).data;
      selectedTrainSetName.value = response;

      ElNotification({
        title: 'Info',
        message: h('i', { style: 'color: teal' }, 'Training set file is successfully uploaded'),
        type: 'info',
      });

      await settingTheModelInfo();
    }

    const submitUpload = async () => {
      upload.value.submit();
    }

    return{
      receiveMessage,
      modelInfo,
      types,
      name,
      index,
      statuses,
      form,
      isNameEditing,
      files,
      selectedTrainSetName,
      modelId,
      handleExceed,
      submitUpload,
      handleSaveTrainSet,
      getKeyByValue,
      upload,
      selectedFile,
      handleUploadBefore,
      getUrlForUploadFile,
      handleSuccess
    }
  }
}

</script>

<style scoped>

</style>