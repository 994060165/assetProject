<template>
  <div v-loading="loading">
    <el-row class="padding-10  text-right">
      <el-button @click="viewAssets" type="primary">预览({{selectSize}})</el-button>
      <el-button :disabled="selectionArr.length === 0" @click="rejectAll()" type="primary">删除</el-button>
      <el-button :disabled="selectionArr.length === 0" @click="confirmAsset" type="primary">确认打印</el-button>
      <el-input 
        class="w-400"
        placeholder="请输入资产名称/资产编码/责任部门/责任人"
        v-model="keystr" @keyup.enter.native="getTableList">
        <el-button slot="append" icon="el-icon-search" @click="getTableList"></el-button>
      </el-input>
    </el-row>
    <el-row class="padding-10">
      <el-table :data="tableList" 
        ref="table"
        @selection-change="selectionTableData"
        @select="selectData"
        @select-all="selectAll">
        <el-table-column type="selection" width="50" ></el-table-column>
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
        @size-change="handleSizeChange"
        :page-sizes="[10, 50, 100, 200, 400, 600, 800, 1000]"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </el-row>
    <el-dialog title="已选择标签" :visible.sync="dialogVisible" :before-close="closeDialog">
      <el-row>
        <el-table :data="selectionArr">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="设备名称" width="250"></el-table-column>
          <el-table-column prop="asset_num" label="资产编号"></el-table-column>
          <el-table-column prop="location" label="设备位置"></el-table-column>
          <el-table-column prop="print_status" label="打印状态"></el-table-column>
          <el-table-column prop="epc" label="epc编码 "></el-table-column>
          <el-table-column prop="deparment" label="部门 "></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteSelection(scope.$index, scope.row.asset_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row slot="footer" class="dialog-footer">
        <!-- <el-button @click="closeDialog">确定</el-button> -->
        <el-button type="primary" @click="confirmAsset">确认打印</el-button>
      </el-row>
    </el-dialog>
    
    <el-dialog title="选择打印模板" :visible.sync="dialogVisible2" :before-close="closeDialog2">
      <el-row>
        <el-select v-model="tagId">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div>
            <img v-if="tagId" :src="imgObj[tagId]" alt="" style="width: 200px;">
        </div>
      </el-row>
      <el-row slot="footer" class="dialog-footer">
        <el-button type="primary" @click="putAssetStatus">确定</el-button>
      </el-row>
    </el-dialog>
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
      tagId: null,
      selectionsMap: new Map(),
      loading2: false,
      selectSize: 0,
      dialogVisible: false,
      dialogVisible2: false,
      selectionArr: [],
      options: [],
      fileList: [],
      imgObj: {}
    }
  },
  mounted () {
    this.getTableList()
    this.getTpl()
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
      this.$request.post('/res/index/getassetlike', params).then(res => {
        let data = res.data
        this.tableList = data.data
        this.loading = false
        this.total = data.count
        this.$nextTick(() => {
          let rows = this.checkMapData(data.data)
          rows.forEach(row => {
            this.$refs.table.toggleRowSelection(row, true)
          })
        })
      }, error => {
        console.log(error)
        this.loading = false
      })
    },
    handleChange (val) {
      this.page = val
      this.getTableList()
    },
    // 关闭窗口
    closeDialog () {
      this.dialogVisible = false
    },
    closeDialog2 () {
      this.dialogVisible2 = false
    },
    // 预览
    viewAssets () {
      this.dialogVisible = true
    },
    // 点击打印执行
    confirmAsset () {
      this.closeDialog()
      this.dialogVisible2 = true
    },
    // 更新状态
    putAssetStatus () {
      if (this.tagId) {
        let arr = []
        for (let [key, value] of this.selectionsMap) {
          console.log(key)
          let asset = {
            asset_id: value.asset_id,
            print_status: '打印中'
          }
          arr.push(asset)
        }
        this.postAsset(arr)
      } else {
        this.$message({
          type: 'error',
          message: '请选择打印模板'
        })
      }
    },
    // 删除已选择的
    deleteSelection (index, id) {
      this.selectionArr.splice(index, 1)
      this.selectionsMap.delete(`${id}`)
      let rows = this.checkMapData(this.tableList)
      // 先清空 再赋值
      this.$refs.table.clearSelection()
      rows.forEach(row => {
        this.$refs.table.toggleRowSelection(row, true)
      })
    },
    // 获取模板
    getTpl () {
      let params = {
        keystr: '',
        page: 1,
        pagesize: 1000,
        token: this.token
      }
      this.$request.post('/res/index/getTpl', params).then(res => {
        let data = res.data
        if (data.data) {
          let arr = []
          let imgObj = {}
          data.data.forEach(value => {
            if (value.ordertag === '1') {
              this.tagId = value.tag_tpl_id
            }
            let obj = {
              label: value.tpl_name,
              value: value.tag_tpl_id
            }
            imgObj[value.tag_tpl_id] = value.img
            arr.push(obj)
          })
          this.options = arr
          this.imgObj = imgObj
        }
      })
    },
    postAsset (arr) {
      let params = {
        token: this.token,
        print_list: JSON.stringify(arr),
        tag_tpl_id: this.tagId
      }
      // this.$request.post('/res/index/ChangePrintStatusAll', params).then(res => {
      this.$request.post('/res/index/SetPrintCommandAndStatus', params).then(res => {
        let data = res.data
        let that = this
        if (data.ID === '1') {
          this.$message({
            type: 'success',
            message: `操作成功`
          })
          this.selectionsMap = new Map()
          this.getTableList()
          this.closeDialog2()
        } else {
          that.$message(`${data.msg}`)
        }
      }, err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: `操作失败！`
        })
      })
    },
    rejectAll () {
      let arr = []
      for (let [key, value] of this.selectionsMap) {
        console.log(key)
        let asset = {
          asset_id: value.asset_id,
          print_status: '未打印'
        }
        arr.push(asset)
      }
      this.changeAssetStatus(arr)
    },
    changeStatus (row, str) {
      let arr = []
      let asset = {
        asset_id: row.asset_id,
        print_status: str
      }
      arr.push(asset)
      this.changeAssetStatus(arr)
    },
    changeAssetStatus (arr) {
      let params = {
        token: this.token,
        print_list: JSON.stringify(arr)
      }
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
      this.putData()
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
    // 写入selectionArr
    putData () {
      this.$set(this, 'selectSize', this.selectionsMap.size)
      let arr = []
      this.selectionsMap.forEach(function (value, key) {
        arr.push(value)
      }, this.selectionsMap)
      this.selectionArr = arr
    },
    // 选择map
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
    handleSizeChange (val) {
      this.page = 1
      this.pagesize = val
      this.getTableList()
      // if (this.isFuzzy) {
      // } else {
      //   this.handleSearch()
      // }
    }
  },
  computed: {
  }
}
</script>

<style lang="scss">

</style>
