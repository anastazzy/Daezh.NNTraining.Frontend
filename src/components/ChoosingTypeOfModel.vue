<template>
  <div>
    <el-radio-group v-model="typeOfModel" size="large">
      <el-radio-button label="Data prediction"/><br>
      <el-radio-button label="Classify MNIST" disabled/>
      <el-radio-button label="other1" disabled/>
      <el-radio-button label="other2" disabled/>
    </el-radio-group>
  </div>
  {{typeOfModel}}
</template>

<script>
// import axios from "axios"
export default {
  name: "ChoosingTypeOfModel",
  methods:{
    choosingTheModel: async function (){

    }
  },
  data(){
    return{
      typeOfModel: "other1",
    }
  }
}
</script>

<style scoped>

</style>