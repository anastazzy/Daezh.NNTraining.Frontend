<template>
  <div>
    <el-table
        :data="listOfModels"
        highlight-current-row
        style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="name" width="120" />
      <el-table-column prop="modelStatus" width="120" />
    </el-table>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import axios from "axios";

export default {
  name: "ListModels",
  setup() {
    const listOfModels = ref([])

    onMounted(async () => {
      let response = await axios.get('/CrudModel');
      listOfModels.value = response.data;
    })
    return {
      listOfModels,
    }
  }
}

</script>
