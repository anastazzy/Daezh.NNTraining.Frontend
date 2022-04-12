<template>
<!--  <StartWindow/>-->
<!--  <div class="models" v-for="type in listTypeOfModels">-->

    <el-table
        :data="listTypeOfModels"
        highlight-current-row
        style="width: 100%"
        v-model="modelType"
        @current-change="onRowChange">
      <el-table-column type="index" width="50" />
      <el-table-column prop="name" label="Type" width="120" />
    </el-table>
<!--  </div>-->
</template>

<script>
import StartWindow from "@/components/StartWindow";
import axios from "axios";
import { ref, onMounted } from "vue";
import { ElTable } from 'element-plus'



export default {
  name: "ChoseModelBeforeCreating",
  components: {
    StartWindow
  },
  setup() {
    const listTypeOfModels = ref([])
    const modelType = ref(null)

    onMounted(async () => {
      let response = await axios.get('/CrudModel/types');
      listTypeOfModels.value = response.data;
    })

    const onRowChange = (value) => {
      console.log(value);
    }

    return {
      modelType,
      listTypeOfModels,
      onRowChange
    }
  }
}

</script>