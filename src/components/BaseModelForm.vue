<template>
  <template v-if="modelInfo">
    <el-descriptions
        title="Description of model"
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
      <el-descriptions-item label="Parameters">
        {{modelInfo.parameters}}
        {{types}}
<!--        TODO: make component witch can swith types of models-->
      </el-descriptions-item>
    </el-descriptions>
    <el-button type="primary">
      Edit
    </el-button>
    <el-button>
      Save
    </el-button>
  </template>

  <el-form>
<!--    <el-form-item label="Model name">-->
<!--      <el-input v-model="form.name" model-value=""/>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="Model type">-->
<!--      <el-select  v-model="form.type" placeholder="please select type of your model">-->
<!--        <el-option v-for="item in types" label="{{item.name}}" value="{{item.id}}" />-->
<!--      </el-select>-->
<!--    </el-form-item>-->
<!--    <el-upload-->
<!--        ref="upload"-->
<!--        class="upload-demo"-->
<!--        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"-->
<!--        :limit="1"-->
<!--        :on-exceed="handleExceed"-->
<!--        :auto-upload="false"-->
<!--    >-->
<!--      <template>-->
<!--        <el-button type="primary">select file</el-button>-->
<!--      </template>-->
<!--      <el-button class="ml-3" type="success" @click="submitUpload">-->
<!--        upload to server-->
<!--      </el-button>-->
<!--      <template>-->
<!--        <div class="el-upload__tip text-red">-->
<!--          limit 1 file, new file will cover the old file-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-upload>-->
  </el-form>
</template>

<script>
import { ref, onMounted } from "vue";
import {reactive} from 'vue'
import axios from "axios";
import { genFileId } from 'element-plus'

export default {
  name: "BaseModelForm",
  props: {
    modelInfo: {
      type: Object,
      default: null,
    },
    name:{
      type: String,
      default: null,
    },
    type:{
      type: String,
      default: null,
    },
    status:{
      type: String,
      default: null,
    },
    parameters:{
      type: Array,
      default: null,
    }
  },

  components: {
  },

  setup() {
    const types = ref([]);
    const statuses = ref([]);
    const form = reactive({
      name: '',
      type: '',
    })
    const upload = ref();

    onMounted(async () => {
      types.value = (await axios.get('/BaseModelService/types')).data;
      statuses.value = (await axios.get('/BaseModelService/statuses')).data;
    })

    const onSubmit = () => {
      console.log('submit!')
    }

    const handleExceed = (files) => {
      upload.value.clearFiles()
      const file = files[0]
      file.uid = genFileId()
      upload.value.handleStart(file)
    }

    const submitUpload = () => {
      upload.value.submit()
    }

    return {
      types,
      statuses,
      form
    }
  }
}


</script>