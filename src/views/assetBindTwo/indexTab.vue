<template>
  <div v-loading="loading">
    <el-row class="padding-10  text-right">
      <el-input 
        class="w-400"
        placeholder="请输入资产名称/资产编码/责任部门/责任人"
        v-model="keystr" @keyup.enter.native="getTableList">
        <el-button slot="append" icon="el-icon-search" @click="getTableList"></el-button>
      </el-input>
    </el-row>
    <el-row class="padding-10">
      <el-table :data="tableList" border>
        <el-table-column type="index" label="序号" width="50" ></el-table-column>
        <el-table-column prop="name" label="设备名称" width="250"></el-table-column>
        <el-table-column prop="asset_num" label="资产编号"></el-table-column>
        <el-table-column prop="location" label="设备位置"></el-table-column>
        <el-table-column prop="deparment" label="部门" ></el-table-column>
        <el-table-column prop="print_status" label="打印状态"></el-table-column>
        <el-table-column prop="epc" label="epc编码 "></el-table-column>
        <el-table-column label="操作" width="50" v-if="type==='1'">
          <template slot-scope="scope">
            <el-button
              type="primary" 
              icon="el-icon-edit" 
              title="改为待打印"
              @click="changeStatus(scope.row, '待打印')"
              size="mini" >
            </el-button>
          </template>
          
        </el-table-column>
        <el-table-column label="操作" width="50" v-else>
          <template slot-scope="scope">
            <el-button
              type="danger" 
              icon="el-icon-delete" 
              title="改为未打印"
              @click="changeStatus(scope.row, '未打印')"
              size="mini" >
            </el-button>
          </template>
          
        </el-table-column>
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
import {TokenAPI} from '@/request/TokenAPI'
export default {
  props: {
    printStatus: {
      type: String,
      default: '待打印,补打'
    },
    type: {
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      tableList: [],
      page: 1,
      pagesize: 10,
      total: 0,
      loading: false,
      keystr: '',
      token: TokenAPI.getToken(),
      org: TokenAPI.getOrg()
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
        keystr: this.keystr,
        deparment: this.org.OrgName,
        deparment_id: this.org.OrgID
      }
      this.$request.post('/res/index/getassetlike', params).then(res => {
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
    },
    changeStatus (row, str) {
      let arr = []
      let asset = {
        asset_id: row.asset_id,
        print_status: str
      }
      arr.push(asset)
      this.postAsset(arr)
    },
    postAsset (arr) {
      let params = {
        token: this.token,
        print_list: JSON.stringify(arr)
      }
      console.log(Object.assign(params))
      this.$request.post('/res/index/ChangePrintStatusAll', params).then(res => {
        let data = res.data
        let that = this
        if (data.ID === '1') {
          this.$message({
            type: 'success',
            message: `操作成功`
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
  },
  computed: {
  }
}
</script>

<style lang="scss">

</style>
