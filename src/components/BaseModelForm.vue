<template>
  <el-form>
    <el-form-item label="Model name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="Model type">
      <el-select  v-model="form.type" placeholder="please select type of your model">
        <el-option v-for="item in types" label="{{item.name}}" value="{{item.id}}" />
      </el-select>
    </el-form-item>
    <el-upload
        ref="upload"
        class="upload-demo"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :limit="1"
        :on-exceed="handleExceed"
        :auto-upload="false"
    >
      <template #trigger>
        <el-button type="primary">select file</el-button>
      </template>
      <el-button class="ml-3" type="success" @click="submitUpload">
        upload to server
      </el-button>
      <template #tip>
        <div class="el-upload__tip text-red">
          limit 1 file, new file will cover the old file
        </div>
      </template>
    </el-upload>
  </el-form>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue/dist/vue";
import {reactive} from 'vue'
import axios from "axios";
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

export default {
  name: "BaseModelForm",
  components: {
  },

  setup() {
    const types = ref([]);
    const form = reactive({
      name: '',
      type: '',
    })
    const upload = ref<UploadInstance>()

    onMounted(async () => {
      types.value = (await axios.get('/BaseModelService/types')).data;
    })

    const onSubmit = () => {
      console.log('submit!')
    }

    const handleExceed: UploadProps['onExceed'] = (files) => {
      upload.value!.clearFiles()
      const file = files[0] as UploadRawFile
      file.uid = genFileId()
      upload.value!.handleStart(file)
    }

    const submitUpload = () => {
      upload.value!.submit()
    }

    return {
      types,
      form
    }
  }

}


</script>