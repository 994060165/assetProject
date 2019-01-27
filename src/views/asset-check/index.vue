<template>
<div class="asset-check">
  <el-row class="padding-10  text-right">
    <el-select v-model="finished" placeholder="请选择计划状态" @change="handleChange">
        <el-option label="全部" value=""></el-option>
        <el-option label="未盘点" value="未盘点"></el-option>
        <el-option label="待盘点" value="待盘点"></el-option>
        <el-option label="盘点中" value="盘点中"></el-option>
        <el-option label="已完成" value="已完成"></el-option>
      </el-select>
      <el-input 
        class="w-400"
        placeholder="请输入资产名称/品牌/标签号/型号/责任部门/责任人"
        v-model="keystr" @keyup.enter.native="handleRefresh">
        <el-button slot="append" icon="el-icon-search" @click="handleRefresh"></el-button>
      </el-input>
      <el-button type="primary" icon="plus" @click="addPlan()">新增盘点计划</el-button>
  </el-row>
   <el-row class="padding-10">
      <el-table
        border
        ref="table"
        :data="allChecks">
        <el-table-column prop="plan_name" label="计划名称"></el-table-column>
        <el-table-column prop="plan_memo" label="计划说明">
        </el-table-column>
        <el-table-column prop="deadline" label="截止时间"></el-table-column>
        <el-table-column prop="create_person" label="创建人"></el-table-column>
        <el-table-column  width="120" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-view" title="查看计划" size="mini" @click="toAddBind(scope.row.plan_id)"></el-button>
            <el-button
              type="success" 
              icon="el-icon-edit" 
              title="开启计划" 
              size="mini" 
              v-if="scope.row.exeResult === '未盘点'"
              @click="changeStatus(scope.row)"></el-button>


            <el-button type="danger" icon="el-icon-delete" title="删除计划" size="mini" @click="deletePlan(scope.row.plan_id)"></el-button>
            
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

  <detail ref="detail"></detail>
  <insert
    ref="insert"
    @refresh="closeInsertDialog"
    :insertVisible="insertVisible"></insert>
</div>
</template>

<script>
import datagrid from '@/components/common/datagrid.vue'
import detail from '@/views/asset-check/_detail.vue'
import insert from '@/views/asset-check/_insert.vue'
import api from '@/api'

export default {
  components: {
    datagrid,
    detail,
    insert
  },
  mounted () {
    this.handleRefresh()
  },
  data () {
    return {
      allChecks: [],
      currentAsset: {},
      finished: '',
      insertVisible: false,
      keystr: '',
      page: 1,
      pagesize: 10,
      total: 0
    }
  },
  methods: {
    closeInsertDialog () {
      this.insertVisible = false
      this.handleRefresh()
    },
    handleChange (val) {
      this.page = val
      this.handleRefresh()
    },
    handleRefresh () {
      this.loading = true
      let params = {
        plan_name: this.keystr,
        exeResult: this.finished,
        page: this.page,
        pagesize: this.pagesize,
        token: window.sessionStorage.getItem('token')
      }
      api.getchecksplan(params).then(data => {
        this.allChecks = data.data
        this.total = data.count
        this.loading = false
      }, err => {
        console.log(err)
        this.loading = false
      })
    },
    // 新增盘点计划
    addPlan () {
      this.insertVisible = true
    },
    deletePlan (id) {
      this.$confirm('删除盘点计划（同时删除盘点计划下面的所有资产信息）?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          token: window.sessionStorage.getItem('token'),
          plan_id: id
        }
        this.$request.post(`/res/index/deletechecksplan`, params).then(res => {
          let data = res.data
          if (data.ID === '-1') {
            this.$message({
              type: 'error',
              message: `操作失败！${data.msg}`
            })
          } else {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.handleRefresh()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除!'
        })
      })
    },
    toAddBind (id) {
      this.$router.push({path: `/asset-bindcheck/${id}`})
    },
    changeStatus (row) {
      this.$confirm('是否将计划状态更改为待盘点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = Object.assign({}, row)
        params.exeResult = '待盘点'
        params.token = window.sessionStorage.getItem('token')
        this.$request.post(`/res/index/putchecksplan`, params).then(res => {
          let data = res.data
          if (data.ID === '-1') {
            this.$message({
              type: 'error',
              message: `操作失败！${data.msg}`
            })
          } else {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.handleRefresh()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消更改!'
        })
      })
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
