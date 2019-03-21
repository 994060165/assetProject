<template>
  <div v-loading="loading">
    <el-row class="padding-10  text-right">
      <el-button @click="viewAssets" type="primary">预览({{selectSize}})</el-button>
      <el-button @click="auditAll('驳回')" type="danger">批量回退</el-button>
      <el-button @click="auditAll('已绑定')" type="primary">批量通过</el-button>
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
        <el-table-column prop="name" label="设备名称" width="100"></el-table-column>
        <el-table-column label="资产编号" width="180" prop="asset_num">
        </el-table-column>
        <!-- <el-table-column prop="tag_num" label="资产编号"></el-table-column> -->
        <el-table-column prop="location" label="设备位置"></el-table-column>
        <!-- <el-table-column prop="parent_tag_num" label="父资产标签号"></el-table-column>
        <el-table-column prop="parent_name" label="父资产名称"></el-table-column> -->
        <el-table-column prop="value" label="基本当前成本 "></el-table-column>
        <el-table-column prop="start_time" label="启用日期">
          <template slot-scope="scope">
            {{scope.row.start_time | moment}}
          </template>
        </el-table-column>
        <el-table-column prop="zrr_name" label="责任人"></el-table-column>
        <el-table-column prop="deparment" label="部门 "></el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button @click="seeDetail(scope.row)" type="primary" size="small">查看</el-button>
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
        <!-- <el-button type="primary" @click="confirmAsset">确认打印</el-button> -->
        <el-button @click="auditAll('驳回')" type="danger">批量回退</el-button>
        <el-button @click="auditAll('已绑定')" type="primary">批量通过</el-button>
      </el-row>
    </el-dialog>
  <detail 
    ref="detail"
    :visible="visible"
    :assetid="assetid"
    :assetnum="assetnum"
    :imgs="imgs"
    @closeDialog="closeImgDialog">
  </detail>
  </div>
</template>

<script>
import {TokenAPI} from '@/request/TokenAPI'
import detail from '@/components/asset/detail.vue'
import api from '@/api'
export default {
  props: {
    bindStatus: {
      type: String,
      default: '待审核'
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
      imgObj: {},
      visible: false,
      imgs: {},
      assetid: '',
      assetnum: ''
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
        bind_status: this.bindStatus,
        keystr: this.keystr,
        token: this.token
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
    seeDetail (row) {
      this.assetnum = `${row.asset_num}`
      this.assetid = `${row.asset_id}`
      this.visible = true
      this.$refs.detail.asset = row
      let params = {
        asset_id: row.asset_id,
        asset_num: row.asset_num,
        token: this.token
      }
      api.getAssetImgToBase64(params).then(data => {
        if (data.ID === '-1') {
          this.$message({
            type: 'error',
            message: `${data.msg}`
          })
        } else {
          console.log(data)
          this.imgs = data
        }
      })
    },
    handleChange (val) {
      this.page = val
      this.getTableList()
    },
    // 关闭窗口
    closeImgDialog () {
      this.visible = false
      this.assetnum = ''
      this.assetid = ''
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
    auditAll (status) {
      let arr = []
      for (let [key, value] of this.selectionsMap) {
        console.log(key)
        let asset = {
          asset_id: value.asset_id,
          bind_status: status
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
        asset_list: JSON.stringify(arr)
      }
      this.$request.post('/res/index/ChangeTagStatusAll', params).then(res => {
        let data = res.data
        let that = this
        if (data.ID === '-1') {
          console.log(this.$message)
          that.$message(`${data.msg}`)
        } else {
          this.$message({
            type: 'success',
            message: `操作成功`
          })
          this.closeDialog()
          this.selectionsMap = new Map()
          this.getTableList()
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
  },
  components: {
    detail
  }
}
</script>

<style lang="scss">

</style>
