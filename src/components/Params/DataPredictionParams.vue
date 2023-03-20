<template>
  <template v-if="parameters">
    <el-descriptions
        title="3 - Model parameters"
        :column="parameters.length"
    >
      <div v-for="(value, key) in parameters">
        <div v-if="key!=='nameOfTrainSet'" >
          <el-descriptions-item :label="key">
            {{value}}
          </el-descriptions-item>
        </div>
      </div>
    </el-descriptions>
    <el-descriptions>
      <el-descriptions-item>
        <!--изменить, при нажатии на кнопку открывается форма, куда подгружаются значения как дефолтные-->
        <el-button @click="dialogTableVisible = true">Edit parameters</el-button>
        <el-dialog v-model="dialogTableVisible" title="Filling the parameters value">
          <el-form :model="form" label-width="160px">
            <div v-for="(value, key) in parameters">
              <div v-if="key!=='nameOfTrainSet'" >
                <div v-if="value === true || value === false">
                  <el-form-item :label="key">
                    <el-radio-group v-model="form[key]" class="ml-4">
                      <el-radio label="true" size="large">true</el-radio>
                      <el-radio label="false" size="large">false</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div v-else>
                  <el-form-item :label="key">
                    <el-col :span="12">
                      <el-input v-model="form[key]" />
                    </el-col>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
          <el-button type="primary" @click="onSave">
            Save information
          </el-button>
        </el-dialog>
      </el-descriptions-item>
    </el-descriptions>
  </template>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "DataPredictionParams",
  props:{
    parameters: {
      type: Object,
      default: null
    },
  },
  methods:{
    onSave (event) {
      this.$emit('saveParams', this.form)
      this.dialogTableVisible = false;
    }
  },
  computed:{
  },
  setup(){
    const upload = ref(null);
    const dialogTableVisible = ref(false);
    const form = ref([]);

    return{
      form,
      dialogTableVisible,
      upload
    }
  }
}
</script>

<style scoped>

</style>