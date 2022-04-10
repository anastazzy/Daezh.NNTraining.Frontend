<template>
  <div>

  </div>
    <div class="common-layout">
      <el-container>
        <el-header>
          <!--        Header-->
        </el-header>
        <el-container>
          <el-aside width="200px">
            <!--          Aside-->
          </el-aside>
          <el-main>
            <!--          Main-->
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script>
import { defineComponent, ref} from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter();
    const handleSelect = (key, keyPath) => {
      router.push({name: key})
    };
    return {
      handleSelect,
    };
  },
});
</script>
