<template>
  <div v-loading="loading2">
    <el-row class="padding-10  text-right">
      <!-- <el-upload
        action=""
        ref="upload"
        :multiple="false"
        :before-upload="beforeUpload"
        :limit="1"
        :file-list="fileList">
        <el-button size="small" type="text"><i class="el-icon-upload2 upload" @clik="submitUpload"></i>点击上传</el-button>
      </el-upload> -->
      <el-button @click="confirmAsset" type="primary" :disabled="selectSize === 0">改为待打印</el-button>
      <el-button @click="viewAssets" type="primary">预览({{selectSize}})</el-button>
      <el-input 
        class="w-400"
        placeholder="请输入资产名称/资产编码/责任部门/责任人"
        v-model="keystr" @keyup.enter.native="getTable">
        <el-button slot="append" icon="el-icon-search" @click="getTable"></el-button>
      </el-input>
    </el-row>
    
    <el-row class="padding-10">
      <el-table
        border
        ref="table"
        :data="tableList" 
        @selection-change="selectionTableData"
        @select="selectData"
        @select-all="selectAll">
        <el-table-column type="selection" width="50" ></el-table-column>
        <el-table-column prop="name" label="设备名称" width="250"></el-table-column>
        <el-table-column prop="asset_num" label="资产编号"></el-table-column>
        <el-table-column prop="location" label="设备位置"></el-table-column>
        <el-table-column prop="print_status" label="打印状态"></el-table-column>
        <el-table-column prop="epc" label="epc编码 "></el-table-column>
        <el-table-column prop="deparment" label="部门 "></el-table-column>
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
        <el-button type="primary" @click="confirmAsset">改为待打印</el-button>
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
      default: '已打印'
    }
  },
  data () {
    return {
      tableList: [],
      page: 1,
      pagesize: 50,
      total: 0,
      keystr: '',
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
      token: TokenAPI.getToken()
    }
  },
  mounted () {
    this.getTableList()
    this.getTpl()
  },
  computed: {
  },
  methods: {
    // 字符串查询列表
    getTable () {
      this.page = 1
      this.getTableList()
    },
    // 查询列表
    getTableList () {
      this.loading2 = true
      let params = {
        page: this.page,
        pagesize: this.pagesize,
        print_status: this.printStatus,
        keystr: this.keystr
      }
      this.$request.post('/res/index/getassetlike', params).then(res => {
        let data = res.data
        this.loading2 = false
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
    // 改变页签
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
      // let arr = Array.from(new Set(this.selectionsMap))
      let arr = []
      this.selectionsMap.forEach(function (value, key) {
        arr.push(value)
      }, this.selectionsMap)
      this.selectionArr = arr
      console.log('arr', this.selectionArr)
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
    // 点击打印执行
    confirmAsset () {
      // this.closeDialog()
      // this.dialogVisible2 = true
      this.putAssetStatus()
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
    // 更新状态
    putAssetStatus () {
      // if (this.tagId) {
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
      // } else {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择打印模板'
      //   })
      // }
    },
    // 更新状态之后，传送数据回服务器
    postAsset (arr) {
      let params = {
        token: this.token,
        print_list: JSON.stringify(arr),
        tag_tpl_id: this.tagId
      }
      this.$request.post('/res/index/ChangePrintStatusAll', params).then(res => {
      // this.$request.post('/res/index/SetPrintCommandAndStatus', params).then(res => {
        let data = res.data
        let that = this
        if (data.ID === '1') {
          this.$message({
            type: 'success',
            message: `操作成功`
          })
          this.selectionsMap.clear()
          this.getTableList()
          this.closeDialog2()
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
    // 预览
    viewAssets () {
      console.log('view')
      this.dialogVisible = true
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
    // 关闭窗口
    closeDialog () {
      this.dialogVisible = false
    },
    closeDialog2 () {
      this.dialogVisible2 = false
    }
    // submitUpload () {
    //   this.$refs.upload.submit()
    // },
    // beforeUpload (file) {
    //   let reader = new FileReader()
    //   reader.readAsDataURL(file)
    //   var that = this
    //   let fileData = null
    //   reader.onloadend = function () {
    //     fileData = reader.result
    //     console.log(fileData)
    //     let params = {
    //       imgbase64: `${fileData}`,
    //       token: JSON.parse(window.sessionStorage.getItem('token')),
    //       asset_num: '00-13095',
    //       imgSeq: 2,
    //       asset_name: '等静压机'
    //     }
    //     that.$request.post('/res/index/putAssetImg', params).then(res => {
    //       console.log(res)
    //     })
    //   }
    //   return false
    // }
  }
}
</script>

<style lang="scss">

</style>
