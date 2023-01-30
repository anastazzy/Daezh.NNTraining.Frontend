<template>
  <template v-if="parameters">
    <el-descriptions
        title="3 - Model parameters"
        :column="3"
    >
      <div v-for="(value, key) in parameters">
        <div v-if="key!=='nameOfTrainSet'" >
          <el-descriptions-item :label="key">
            {{value}}
          </el-descriptions-item>
        </div>
      </div>
    </el-descriptions>
  </template>
</template>

<script>
export default {
  name: "DataPredictionParams",
  props:{
    parameters: {
      type: Array,
      default: null
    },
  },
  computed:{
  }
}
</script>

<style scoped>

</style>