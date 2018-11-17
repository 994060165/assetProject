<template>
  <div v-loading="loading">
    <el-row class="padding-10  text-right">
      <el-input 
        class="w-400"
        placeholder="请输入资产名称/品牌/标签号/型号/责任部门"
        v-model="keystr" @keyup.enter.native="getTableList">
        <el-button slot="append" icon="el-icon-search" @click="getTableList"></el-button>
      </el-input>
    </el-row>
    <el-row class="padding-10">
      <el-table :data="tableList" border>
        <el-table-column type="index" label="序号" width="50" ></el-table-column>
        <el-table-column prop="name" label="设备名称" width="250"></el-table-column>
        <el-table-column prop="asset_num" label="设备标签号"></el-table-column>
        <el-table-column prop="location" label="设备位置"></el-table-column>
        <el-table-column prop="print_status" label="打印状态"></el-table-column>
        <el-table-column prop="check_result" label="打印结果 "></el-table-column>
      </el-table>
    </el-row>
    <el-row class="padding-10 text-right">
      <el-pagination
        @current-change="handleChange"
        :current-page="page"
        :page-size="pagesize"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    printStatus: {
      type: String,
      default: '已打印'
    }
  },
  data () {
    return {
      tableList: [],
      page: 1,
      pagesize: 10,
      total: 0,
      loading: false,
      keystr: ''
    }
  },
  mounted () {
    this.getTableList()
  },
  methods: {
    getTableList () {
      this.loading = true
      let params = {
        page: this.page,
        pagesize: this.pagesize,
        print_status: this.printStatus,
        keystr: this.keystr
      }
      this.$request.post('/res/index/getasset', params).then(res => {
        let data = res.data
        this.tableList = data.data
        this.loading = false
        this.total = data.count
      }, error => {
        console.log(error)
        this.loading = false
      })
    },
    handleChange (val) {
      this.page = val
      this.getTableList()
    }
  },
  computed: {
  }
}
</script>

<style lang="scss">

</style>
