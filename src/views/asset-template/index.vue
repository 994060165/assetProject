<template>
<div class="asset-tpl">
  <el-row class="padding-10 text-right">
    <el-input class="w-200" v-model="keystr"></el-input>
    <el-button @click="addTemplate" type="primary">新增模板</el-button>
  </el-row>
  <el-row class="padding-10">
    <el-table :data="tableList">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="tpl_name" label="模板名称"></el-table-column>
      <el-table-column prop="tag_command" label="模板图示">
        <template slot-scope="scope">
           <div>
              <img :src="scope.row.img" alt="" style="width: 200px;">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" title="查看模板" type="success" @click="viewDialog(scope.row)"></el-button>
          <el-button size="mini" icon="el-icon-edit" title="编辑模板" type="primary" @click="editDialog(scope.row)"></el-button>
          <el-button size="mini" icon="el-icon-delete" title="删除模板" type="delete" @click="deleteDialog(scope.row)"></el-button>
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
      tableList: [],
      page: 1,
      pagesize: 10,
      total: 0
    }
  },
  mounted () {
    this.getTableList()
    this.formData = this.initForm()
  },
  methods: {
    // 获取列表数据
    getTableList () {
      let params = {
        keystr: this.keystr,
        page: this.page,
        pagesize: this.pagesize,
        token: window.sessionStorage.getItem('token')
      }
      this.$request.post('/res/index/getTpl', params).then(res => {
        let data = res.data
        this.total = data.count
        this.tableList = data.data
      })
    },
    // 初始化form值
    initForm () {
      let form = {
        tpl_name: '',
        tag_command: '',
        tpl_deparment: '',
        tpl_memo: ''
      }
      return form
    },
    // 添加模板
    addTemplate () {
      this.addTpl = true
    },
    // 关闭编辑窗口
    closeAddDialog () {
      this.addTpl = false
      this.formData = this.initForm()
      this.getTableList()
    },
    // 关闭查看窗口
    closeViewDialog () {
      this.viewTpl = false
      this.formData = this.initForm()
    },
    // 点击查看窗口
    viewDialog (row) {
      this.viewTpl = true
      this.formData = row
    },
    // 打开编辑窗口
    editDialog (row) {
      this.addTpl = true
      this.formData = row
    },
    // 删除模板
    deleteDialog (row) {
      this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          tag_tpl_id: row.tag_tpl_id,
          token: window.sessionStorage.getItem('token')
        }
        this.$request.post('/res/index/deleteTpl', params).then(res => {
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
              message: `删除失败：${data.msg}!`
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
    // 改变页签
    handleChange (val) {
      this.page = val
      this.getTableList()
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
