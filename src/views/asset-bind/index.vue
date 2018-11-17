<template>
<div class="asset-bind">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="已打印" name="1">
      <indexTab :printStatus="overStatus" v-if="activeName === '1'"></indexTab>
    </el-tab-pane>
    <el-tab-pane label="待打印" name="2">
      <indexTab :printStatus="loadStatus" v-if="activeName === '2'"></indexTab>
    </el-tab-pane>
    <el-tab-pane label="未打印" name="3">
      <selectTab  v-if="activeName === '3'"></selectTab>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import indexTab from './indexTab'
import selectTab from './selectTab'
export default {
  data () {
    return {
      activeName: '1',
      overStatus: '已打印',
      loadStatus: '待打印'
    }
  },
  mounted () {
  },
  methods: {
    handleClick (val) {}
  },
  components: {
    indexTab,
    selectTab
  }
}
</script>

<style lang="scss">
.asset-bind{
  .datagrid__action {
    text-align: right;
    position: relative;
    .el-input{
      width: 400px;
    }
  }
}
</style>
