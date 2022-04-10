<template>
  <StartWindow/>
</template>

<script>
import StartWindow from "@/components/StartWindow";
import axios from "axios";

export default {
  name: "ChoseModelBeforeCreating",
  components: {
    StartWindow
  },
  async mounted(){
    let response = await axios.get('/CrudModel/types');
    this.listTypeOfModels = response.data;
  },
  data() {
    return {
      listTypeOfModels:[],

    }
  }
}
</script>

<style scoped>

</style>