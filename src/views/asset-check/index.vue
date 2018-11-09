<template>
<div class="asset-check">

  <datagrid ref="datagrid" :table-data="allChecks">
    
    <template slot="action">
      <el-select v-model="finished" placeholder="请选择任务进度" @change="handleChange">
        <el-option label="全部" value=""></el-option>
        <el-option label="未盘点" value="0"></el-option>
        <el-option label="盘点中" value="1"></el-option>
        <el-option label="已完成" value="2"></el-option>
      </el-select>
      <el-input 
        class="w-400"
        placeholder="请输入资产名称/品牌/标签号/型号/责任部门/责任人"
        v-model="keystr" @keyup.enter.native="handleRefresh">
        <el-button slot="append" icon="el-icon-search" @click="handleRefresh"></el-button>
      </el-input>
      <el-button type="primary" icon="plus" @click="addPlan()">新增盘点任务</el-button>
    </template>
    <template slot="table">
      <el-table-column prop="plan_name" label="任务名称"></el-table-column>
      <el-table-column prop="plan_memo" label="任务说明">
      </el-table-column>
      <el-table-column prop="deadline" label="截止时间"></el-table-column>
      <el-table-column prop="create_person" label="创建人"></el-table-column>
      <el-table-column  width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="toAddBind(scope.row.plan_id)"></el-button>
        </template>
      </el-table-column>
    </template>
  </datagrid>

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
      keystr: ''
    }
  },
  methods: {
    closeInsertDialog () {
      this.insertVisible = false
      this.handleRefresh()
    },
    handleChange () {
      this.handleRefresh()
    },
    handleRefresh () {
      this.$refs.datagrid.table.loading = false
      let params = {
        plan_name: this.keystr,
        exeResult: this.finished,
        page: this.$refs.datagrid.page.currentPage,
        pagesize: this.$refs.datagrid.page.pageSize
      }
      api.getchecksplan(params).then(data => {
        this.allChecks = data.data
        this.$refs.datagrid.page.total = data.count
        this.$refs.datagrid.table.loading = false
      }, err => {
        console.log(err)
        this.$refs.datagrid.table.loading = false
      })
    },
    // 新增盘点计划
    addPlan () {
      this.insertVisible = true
    },
    toAddBind (id) {
      this.$router.push({path: `/asset-bindcheck/${id}`})
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
