<template>
  <el-dialog
    title="选择角色"
    :visible="roledialogVisible"
    @open="retrieveData"
    :showClose="false">
    <el-input
      placeholder="请输入角色代码"
      v-model="queryKey"
      @keyup.enter.native="retrieveData"
      width="100%">
    </el-input>
    <el-row>
      <el-table
        :data="tableData"
        style="width:100%"
        class="role-table"
        v-loading.body="loading"
        @selection-change="handleSelectionChange">
        <!-- <el-table-column
          prop="checked"
          type="selection">
        </el-table-column> -->
        <el-table-column
          type="selection"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="RoleID"
          label="英文代码">
        </el-table-column>
        <el-table-column
          prop="RoleName"
          label="汉语名称">
        </el-table-column>
        <el-table-column
          prop="Detail"
          label="描述">
        </el-table-column>
        <el-table-column
          width="120"
          align="center"
          label="是否启用">
          <template slot-scope="scope">
            <div v-if="scope.row.Tag === '1'" style="text-align:center;">是</div>
            <div v-else style="text-align:center;">否</div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="padding-10 m-t-10 text-right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :disabled="!(selectCandidates.length > 0)">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      roledialogVisible: {
        type: Boolean,
        'default' () {
          return false
        }
      },
      roleUserID: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        tableData: [],
        loading: false,
        currentPage: 1,
        pageSize: 10,
        queryKey: '',
        total: 0,
        selectCandidates: []
      }
    },
    mounted () {
      this.retrieveData()
    },
    computed: {
    },
    watch: {
    },
    created () {
    },
    methods: {
      // 查询所有数据
      retrieveData () {
        let params = {
          page: this.currentPage,
          pagesize: this.pageSize,
          RoleID: this.queryKey
        }
        this.$request.post(`/sys/index/getRolesTree`, params).then(res => {
          this.loading = false
          let data = res.data
          this.total = data.count
          this.tableData = data.data
        }, err => {
          console.log(err)
          this.loading = false
        })
      },
      // 确定
      handleConfirm () {
        if (this.selectCandidates.length > 0) {
          console.log(this.selectCandidates)
          this.$emit('addCancel', this.selectCandidates)
        } else {
          this.$emit('addCancel')
        }
      },
      // 取消
      handleCancel () {
        this.$emit('addCancel')
      },
      // 选择
      handleSelectionChange (val) {
        this.selectCandidates = val
      },
      // 界面改变条数
      handleSizeChange (pageSize) {
        this.pageSize = pageSize
        this.retrieveData()
        this.selectCandidates = []
      },
      // 界面改变页码
      handleCurrentChange (page) {
        this.currentPage = page
        this.retrieveData()
        this.selectCandidates = []
      }
    },
    components: {
    }
  }
</script>
<style lang="css" scoped>
  .member-table {
    text-align: left;
  }
</style>
