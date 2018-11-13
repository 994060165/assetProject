<template>
<div class="asset-check">

  <datagrid ref="datagrid">
    
    <template slot="action">
      <el-input 
        class="w-400"
        placeholder="请输入资产名称/品牌/标签号/型号/责任部门"
        v-model="keystr" @keyup.enter.native="handleRefresh">
        <el-button slot="append" icon="el-icon-search" @click="handleRefresh"></el-button>
      </el-input>
      <el-button type="primary" @click="bindAsset">添加数据</el-button>
    </template>
  </datagrid>
  <el-row>
    <el-table :data="allChecks" v-loading="loading" element-loading-text="数据加载中，请稍候...">
      <el-table-column prop="name" label="设备名称" width="100"></el-table-column>
      <el-table-column prop="asset_num" label="设备标签号"></el-table-column>
      <el-table-column prop="location" label="设备位置"></el-table-column>
      <el-table-column prop="check_person" label="盘点人"></el-table-column>
      <el-table-column label="盘点日期">
        <template slot-scope="scope">
          {{(!!scope.row.check_date) ? (scope.row.check_date | moment) : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="check_flag" label="盘点状态"></el-table-column>
      <el-table-column prop="check_result" label="盘点结果 "></el-table-column>
      <el-table-column  width="100" label="操作">
        <template slot-scope="scope">
          <!-- <el-button icon="el-icon-delete" size="mini" @click="deleteAsset(scope.row.id)"></el-button> -->
          <el-button icon="el-icon-delete" type="primary" size="mini" @click="deleteAsset(scope.row.detail_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  <el-row class="padding-10 text-right">
    <el-pagination
      @current-change="handleChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
  </el-row>
  <el-row>
    <el-dialog
      :visible="bindAssetVisible" 
      :before-close="closeBindDialog"
      width="70%"
      title="添加资产">
      <el-row  class="padding-10 text-right">
         <el-input 
          class="w-400"
          placeholder="请输入资产名称/品牌/标签号/型号/责任部门"
          v-model="assetkeystr" @keyup.enter.native="getAddAssetList">
          <el-button slot="append" icon="el-icon-search" @click="getAddAssetList"></el-button>
        </el-input>
      </el-row>
      <div class="w-full" style="display: flex;">
        <!-- <div class="w-200 padding-10">
          <el-row>
            <el-tree
            ref="depttree"
            :data="deptData"
            node-key="id"
            show-checkbox
            check-strictly
            :props="defaultProps"
            @check-change="handleCheckChange">
            </el-tree>
          </el-row>
        </div> -->
        <div style="flex: 1;" class="padding-10">
           <el-row>
            <el-table :data="assetList" @selection-change="handleSelectionChange" border>
              <el-table-column  width="50" type="selection"></el-table-column>
              <el-table-column prop="asset_num" label="设备名称" width="100"></el-table-column>
              <el-table-column prop="asset_num" label="设备标签号"></el-table-column>
              <el-table-column prop="location" label="设备位置"></el-table-column>
              <!-- <el-table-column prop="parent_tag_num" label="父资产标签号" width="120"></el-table-column> -->
              <el-table-column prop="parent_name" label="父资产名称"></el-table-column>
              <el-table-column prop="start_time" label="启用日期">
                <template slot-scope="scope">
                  {{scope.row.start_time | moment}}
                </template>
              </el-table-column>
              <el-table-column prop="person" label="责任人姓名"></el-table-column>
              <el-table-column prop="deparment" label="部门 "></el-table-column>
              <!-- <el-table-column width="100" label="操作">
                <template slot-scope="scope">
                  <el-button @click="seeDetail(scope.row)" type="primary" size="small">查看</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </el-row>
          <el-row class="padding-10 text-right">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="assetsPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="assetsPagesize"
              layout="total, sizes, prev, pager, next"
              :total="assetsTotal">
            </el-pagination>
          </el-row>
        </div>
      </div>
      <el-row class="padding-10 text-right">
        <el-button  @click="closeBindDialog">取 消</el-button>
        <el-button type="primary" @click="confirmAssets" :disabled="!(assetsSelections.length > 0)">确认添加</el-button>
      </el-row>
    </el-dialog>
  </el-row>
</div>
</template>

<script>
import datagrid from '@/components/common/datagrid.vue'
import api from '@/api'
// import moment from 'moment'
export default {
  components: {
    datagrid
  },
  mounted () {
    this.planId = this.$route.params.planId
    this.handleRefresh()
  },
  data () {
    return {
      loading: false,
      planId: '',
      allChecks: [],
      currentAsset: {},
      finished: '',
      insertVisible: false,
      keystr: '',
      bindAssetVisible: false,
      assetList: [
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      assetsPage: 1,
      assetsPagesize: 100,
      assetsTotal: 0,
      assetkeystr: '',
      assetsSelections: [],
      deptData: [{
        id: 1,
        label: '过程所',
        children: [{
          id: 4,
          label: '实验室1-1',
          children: [{
            id: 9,
            label: '实验室1-2'
          }, {
            id: 10,
            label: '实验室1-3'
          }]
        }]
      }, {
        id: 2,
        label: '财务处',
        children: [{
          id: 5,
          label: '财务1-1'
        }, {
          id: 6,
          label: '财务1-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 为计划绑定资产
    bindAsset () {
      this.bindAssetVisible = true
      this.getAddAssetList()
    },
    // 关闭添加弹窗
    closeBindDialog () {
      this.bindAssetVisible = false
      this.assetsPage = 1
      this.assetsPagesize = 100
    },
    // 查询当前计划的列表
    handleRefresh () {
      this.loading = true
      let params = {
        plan_id: this.planId,
        plan_name: this.keystr,
        exeResult: this.finished,
        page: this.currentPage,
        pagesize: this.pageSize
      }
      api.getPlanAssteList(params).then(data => {
        console.log('data', data)
        this.total = data.count
        this.loading = false
        this.allChecks = data.data
      }, err => {
        console.log(err)
        this.loading = false
      })
    },
    handleChange (val) {
      this.currentPage = val
      this.handleRefresh()
    },
    // 获取要添加的资产信息列表
    getAddAssetList () {
      let params = {
        page: this.assetsPage,
        pagesize: this.assetsPagesize,
        keystr: this.assetkeystr,
        token: JSON.parse(sessionStorage.getItem('token'))
      }
      api.getAssetBase16(params).then(data => {
        this.assetsTotal = data.count
        this.assetList = data.data
      })
    },
    // 资产页码改变
    handleCurrentChange (page) {
      this.assetsPage = page
      this.getAddAssetList()
    },
    // 资产页条数改变
    handleSizeChange (size) {
      this.assetsPagesize = size
      this.getAddAssetList()
    },
    // 选择部门树
    handleCheckChange (data, checked, indeterminate) {
      if (checked && data.children) {
        if (data.children.length > 0) {
          let arr = []
          let nodes = this.$refs.depttree.getCheckedNodes()
          walkDeep(data, function (n) {
            arr.push({...n})
          })
          arr = this.uniq(arr)
          arr = arr.concat(nodes)
          this.$refs.depttree.setCheckedNodes(arr)
        }
      }
      if (checked === false && data.children) {
        if (data.children.length > 0) {
          let arr = []
          walkDeep(data, function (n) {
            arr.push({...n})
          })
          arr = [].concat(this.uniq(arr))
          let checknode = this.$refs.depttree.getCheckedNodes()
          let obj = {}
          let nodes = [].concat(checknode)
          let arr3 = []
          nodes.forEach(value => {
            obj[value.id] = value
          })
          for (let i = 0; i < nodes.length; i++) {
            for (let j = 0; j < arr.length; j++) {
              if (nodes[i].id === arr[j].id) {
                if (obj[nodes[i].id]) {
                  delete obj[nodes[i].id]
                }
              }
            }
          }
          for (let item in obj) {
            arr3.push(obj[item])
          }
          this.$refs.depttree.setCheckedNodes(arr3)
        }
      }
      function walkDeep (input, fn) {
        fn({id: input.id, label: input.label})
        for (let i = 0; i < input.children.length; i++) {
          if (input.children[i].children && input.children[i].children.length > 0) {
            walkDeep(input.children[i], fn)
          }
          fn({id: input.children[i].id, label: input.children[i].label})
        }
      }
    },
    // 去重
    uniq (array) {
      var temp = []
      var index = []
      var l = array.length
      for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
          if (array[i].id === array[j].id) {
            i++
            j = i
          }
        }
        temp.push(array[i])
        index.push(i)
      }
      return temp
    },
    // 拼接tree id
    extractTree () {
    },
    // 删除资产列表中的资产
    deleteAsset (id) {
      let params = {
        plan_id: this.planId,
        token: JSON.parse(sessionStorage.getItem('token')),
        detail_id: id
      }
      api.deletechecksplanDetail(params).then(data => {
        if (data.ID === '1') {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: `${data.msg}`
          })
        }
      })
    },
    // 改变勾选
    handleSelectionChange (sels) {
      console.log(sels)
      this.assetsSelections = sels
    },
    confirmAssets () {
      let assetNum = ''
      if (this.assetsSelections.length > 0) {
        this.assetsSelections.forEach((value, index) => {
          if (index === this.assetsSelections.length - 1) {
            assetNum += value.asset_num
          } else {
            assetNum += `${value.asset_num},`
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请您勾选资产项'
        })
      }
      let params = {
        plan_id: this.planId,
        asset_num: assetNum
      }
      // putcheckdetailAll
      api.putcheckdetailAll(params).then(data => {
        if (data.ID === '1') {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.handleRefresh()
          this.closeBindDialog()
        } else {
          this.$message({
            type: 'warning',
            message: '添加失败'
          })
        }
      })
      let ids = this.$refs.depttree.getCheckedKeys()
      console.log(ids)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/base.scss';

.asset-check{
  .datagrid__action {
    text-align: right;
    position: relative;
    .el-select{
      width: 160px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      margin-top: -$global-gap/2;
    }
  }
  p{
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
  }
}
</style>
