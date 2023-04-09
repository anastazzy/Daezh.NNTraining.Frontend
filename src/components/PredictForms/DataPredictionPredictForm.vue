<template v-if="parameters">
  <el-form
      :model="predictionForm"
      label-width="200px"
  >
    <template v-for="(value, key) in parameters">
        <el-form-item v-if="value === 'String'" :label="key">
          <el-input v-model="predictionForm[key]" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="key" v-else>
          <el-input-number v-model="predictionForm[key]"/>
        </el-form-item>
    </template>
  </el-form>
  <el-footer>
    <span class="dialog-footer">
      <el-button @click="cancel">Cancel</el-button>
    </span>
    <el-button type="primary" @click="predict">
      Predict
    </el-button>
  </el-footer>
  <el-footer v-if="result != null">
    Result of prediction: {{result}}
  </el-footer>
</template>

<script>
import {ref} from "vue";

export default {
  name: "DataPredictionPredictForm",
  props:{
    parameters:{
      type: Object,
      default: null
    },
    result:{
      type: Object,
      default: null
    }
  },
  methods:{
    predict (event) {
      this.$emit('getResult', this.predictionForm)
      this.dialogTableVisible = false;
    },
    cancel (event) {
      this.$emit('cancel')
      this.dialogTableVisible = false;
    }
  },
  setup(){
    const predictionForm = ref({});

    return{
      predictionForm
    }
  }
}
</script>

<style scoped>

</style>