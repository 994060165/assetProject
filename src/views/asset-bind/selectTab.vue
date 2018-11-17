<template>
  <div v-loading="loading2">
    <el-row class="padding-10  text-right">
      <el-input 
        class="w-400"
        placeholder="请输入资产名称/品牌/标签号/型号/责任部门"
        v-model="keystr" @keyup.enter.native="getTableList">
        <el-button slot="append" icon="el-icon-search" @click="getTableList"></el-button>
      </el-input>
    </el-row>
    <el-row class="padding-10">
      <el-table
        ref="table"
        :data="tableList" 
        @selection-change="selectionTableData"
        @select="selectData"
        @select-all="selectAll">
        <el-table-column type="selection" width="50" ></el-table-column>
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
      <el-button @click="putAssetStatus" type="primary">已选择{{selectSize}}条数据</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    printStatus: {
      type: String,
      default: '未打印'
    }
  },
  data () {
    return {
      tableList: [],
      page: 1,
      pagesize: 10,
      total: 0,
      keystr: '',
      selectionsMap: new Map(),
      loading2: false,
      selectSize: 0
    }
  },
  mounted () {
    this.getTableList()
  },
  computed: {
  },
  methods: {
    getTableList () {
      this.loading2 = true
      let params = {
        page: this.page,
        pagesize: this.pagesize,
        print_status: this.printStatus,
        keystr: this.keystr
      }
      this.$request.post('/res/index/getasset', params).then(res => {
        let data = res.data
        if (data.data && data.data.length > 0) {
          this.tableList = data.data
          this.loading2 = false
          this.total = data.count
          this.$nextTick(() => {
            let rows = this.checkMapData(data.data)
            console.log(rows)
            rows.forEach(row => {
              this.$refs.table.toggleRowSelection(row, true)
            })
          })
        }
      }, error => {
        this.loading2 = false
        console.log(error)
      })
    },
    handleChange (val) {
      this.page = val
      this.getTableList()
    },
    // 选取数据变化
    selectionTableData (val) {
      val.forEach(value => {
        let key = `${value.asset_id}`
        this.selectionsMap.set(key, value)
      })
      this.putData()
    },
    // 选取数据
    selectData (selection, row) {
      if (selection.indexOf(row) === -1) {
        let key = `${row.asset_id}`
        this.selectionsMap.delete(key)
      }
    },
    // 选取全部
    selectAll (selection) {
      if (selection && selection.length > 0) {
        selection.forEach(value => {
          let key = `${value.asset_id}`
          this.selectionsMap.set(key, value)
        })
      } else {
        this.tableList.forEach(value => {
          let key = `${value.asset_id}`
          this.selectionsMap.delete(key)
        })
      }
      this.putData()
    },
    putData () {
      this.$set(this, 'selectSize', this.selectionsMap.size)
    },
    checkMapData (data) {
      let arr = []
      data.forEach(value => {
        let id = `${value.asset_id}`
        if (this.selectionsMap.has(id)) {
          arr.push(value)
        }
      })
      return arr
    },
    putAssetStatus () {
      let arr = []
      for (let [key, value] of this.selectionsMap) {
        console.log(key)
        let asset = {
          asset_id: value.asset_id,
          print_status: '待打印'
        }
        arr.push(asset)
      }
      this.postAsset(arr)
    },
    postAsset (arr) {
      let params = {
        token: sessionStorage.getItem('token'),
        print_list: JSON.stringify(arr)
      }
      console.log(Object.assign(params))
      this.$request.post('/res/index/ChangePrintStatusAll', params).then(res => {
        let data = res.data
        let that = this
        if (data.ID === '1') {
          this.$message({
            type: 'success',
            message: `${data.msg}`
          })
          this.selectionsMap = new Map()
          this.getTableList()
        } else {
          console.log(this.$message)
          that.$message(`${data.msg}`)
        }
      }, err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: `操作失败！`
        })
      })
    }
  }
}
</script>

<style lang="scss">

</style>
