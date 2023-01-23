<template>
  <template v-if="parameters">
    <el-descriptions
        title="Model parameters"
        :column="3"
    >
      <div v-for="(value, key) in parameters">
        <el-descriptions-item :label="key">
          {{value}}
        </el-descriptions-item>
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
}
</script>

<style scoped>

</style>