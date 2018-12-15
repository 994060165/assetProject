<template>
<div class="asset-tpl">
  <el-row class="padding-10 text-right">
    <el-input class="w-200"
        v-model="keystr"
        @keyup.enter.native="getTableList">
        <el-button slot="append" icon="el-icon-search" @click="getTableList"></el-button>
    </el-input>
    <!-- <el-button @click="addTemplate" type="primary">新增模板</el-button> -->
  </el-row>
  <el-row class="padding-10">
    <el-table :data="tableList">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="reader_name" label="终端名称"></el-table-column>
      <el-table-column prop="reader_type" label="终端类型"></el-table-column>
      <el-table-column prop="maker_name" label="设备厂商"></el-table-column>
      <el-table-column prop="model_num" label="设备型号"></el-table-column>
      <el-table-column prop="start_time" label="启用日期"></el-table-column>
      <el-table-column prop="status" label="启用状态"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" title="查看设备" type="success" @click="viewDialog(scope.row)"></el-button>
          <el-button size="mini" icon="el-icon-edit" title="编辑设备" type="primary" @click="editDialog(scope.row)"></el-button>
          <el-button size="mini" icon="el-icon-delete" title="删除设备" type="danger" @click="deleteDialog(scope.row)"></el-button>
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
  <add
  v-if="addTpl"
  :visable="addTpl"
  :formData="formData"
  @successFun="successFun"
  @closeDialog="closeAddDialog">
  </add>
  <tplView
  v-if="viewTpl"
  :visable="viewTpl"
  :formData="formData"
  @closeDialog="closeViewDialog">
  </tplView>
</div>
</template>

<script>
import add from './add.vue'
import tplView from './view.vue'
export default {
  data () {
    return {
      keystr: '',
      addTpl: false,
      viewTpl: false,
      formData: {},
      tableList: [
      ],
      page: 1,
      pagesize: 10,
      total: 0
    }
  },
  mounted () {
    this.formData = this.initForm()
    this.getTableList()
  },
  methods: {
    getTableList () {
      let params = {
        page: this.page,
        pagesize: this.pagesize,
        token: window.sessionStorage.getItem('token'),
        keystr: this.keystr
      }
      this.$request.post(`/res/index/getRegDevice`, params).then(res => {
        let data = res.data
        if (data.data) {
          this.tableList = data.data
          this.total = data.count
        }
      })
    },
    initForm () {
      let form = {
        reader_id: '',
        reader_name: '',
        location: null,
        reader_type: '',
        maker_name: '',
        model_num: '',
        status: '',
        start_time: '',
        rdkey: '',
        deparment: null,
        reguser: null
      }
      return form
    },
    addTemplate () {
      this.addTpl = true
    },
    closeAddDialog () {
      this.addTpl = false
      this.formData = this.initForm()
    },
    successFun () {
      this.addTpl = false
      this.formData = this.initForm()
      this.getTableList()
    },
    closeViewDialog () {
      this.viewTpl = false
      this.formData = this.initForm()
    },
    viewDialog (row) {
      this.viewTpl = true
      this.formData = row
    },
    editDialog (row) {
      this.addTpl = true
      this.formData = row
    },
    deleteDialog (row) {
      console.log(row.reader_id)
      this.$confirm('此操作将删除设备注册信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          reader_id: row.reader_id
        }
        this.$request.post(`/res/index/deleteReader`, params).then(res => {
          let data = res.data
          if (data.ID === '1') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败！'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除!'
        })
      })
    },
    handleChange (val) {
      this.page = val
    }
  },
  components: {
    add,
    tplView
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
