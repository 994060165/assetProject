<template lang="html">
  <div class="sys rolelist">
    <el-dialog
      title="删除角色成员"
      :visible.sync="dialogVisible"
      size="tiny">
      <span>确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        <el-button @click="handleDelete">确 定</el-button>
      </span>
    </el-dialog>
    <div id="navbar">
      <el-row :gutter="24" width="100%">
          <el-col :span="12">
            <span class="icon" @click="goBack"></span>
            <span class="title">角色人员</span>
          </el-col>
          <el-col :span="4">
            <el-input
                class="searchBox"
                placeholder="搜索"
                icon="search"
                v-model="queryKey"
                @keyup.enter.native="retrieveData"
                width="100%"
                @click="retrieveData">
              </el-input>
          </el-col>
          <el-col :span="6" style="text-align:center">
            <span style="margin-right:10px;cursor: pointer;" @click="retrieveData">刷新</span>
            <span style="margin-right:10px;cursor: pointer;" @click="showUserDialog">添加人员</span>
            <!-- <span style="margin-right:10px;cursor: pointer;" @click="deleteAll">删除</span> -->
          </el-col>
        </el-row>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;"
      class="member-table"
      @selection-change="handleSelectionChange">
        <!-- <el-table-column
          prop="checked"
          type="selection">
        </el-table-column> -->
        <el-table-column
          type="index"
          label="序号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="UserID"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="UserName"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="UserEmail"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="UserMobile"
          label="手机号">
        </el-table-column>
        <!-- <el-table-column
          label="操作">
          <template scope="scope">
            <i class="delete" @click="confirmDelete(scope.row)"></i>
          </template>
        </el-table-column> -->
    </el-table>
    <div style="width: 100%;background: white;padding: 10px 0;text-align: right;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <searchUserDialog
      :roleId="roleId"
      :dialogVisible="userDialogVisible"
      v-if="userDialogVisible"
      @addSuccess="addMember"
      @addCancel="addCancel">
    </searchUserDialog>
  </div>
</template>
<script>
import searchUserDialog from './userDialog.vue'
export default {
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      roleId: this.$,
      dialogVisible: false,
      multiSelection: [],
      userDialogVisible: false,
      queryKey: ''
    }
  },
  created () {
    this.roleId = this.$route.params.roleId
  },
  mounted () {
    this.retrieveData()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    retrieveData () {
      let params = {
        RoleID: this.roleId,
        page: this.currentPage,
        pagesize: this.pageSize
      }
      this.$request.post('/sys/index/getUsersByRoleID', params).then(res => {
        let data = res.data
        this.tableData = data.data
        this.total = data.count
      })
    },
    confirmDelete (user) {
      this.$confirm(`此操作将从当前角色删除${user.userName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.retrieveData()
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    extractUserIds (users) {
      let userIds = []
      for (let user of users) {
        userIds.push(user.userId)
      }
      return userIds
    },
    handleSelectionChange (val) {
      this.multiSelection = val
    },
    deleteAll () {
      this.dialogVisible = true
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.retrieveData()
    },
    handleCurrentChange (page) {
      this.currentPage = page
      this.retrieveData()
    },
    showUserDialog () {
      this.userDialogVisible = true
    },
    addMember () {
      this.retrieveData()
      this.userDialogVisible = false
    },
    addCancel () {
      this.userDialogVisible = false
    },
    handleDelete () {
      this.dialogVisible = false
      if (this.multiSelection.length > 0) {
      }
    }
  },
  components: {
    searchUserDialog
  }
}
</script>

<style lang="css" scoped>
.opBar {
  float: right;
  padding: 5px;
}
.searchBox {
  display: inline-block;
}
#navbar {
  width: 100%;
  vertical-align:middle;
  margin-bottom: 10px;
  background-color: #fff;
  border-bottom: 1px solid #dedede;
  height: 46px;
  line-height: 46px;
}
.pagnationBar {
  vertical-align: middle;
  margin-bottom: 10px;
  background-color: #fff;
  border-bottom: 1px solid #dedede;
  height: 46px;
  line-height: 46px;
}
.delete {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: url(../../assets/img/dataDictionary/spirit.png)  no-repeat;
  background-position: -10px -30px;
  cursor: pointer;
}
.delete:hover {
  background-position: -38px -30px;
}
.icon{
  background: url(../../assets/img/personnel/goback.png) center center no-repeat;
  display: inline-block;
  width: 40px;
  height: 46px;
  line-height: 46px;
  float: left;
  cursor: pointer;
}
.icon:hover {
  background: url(../../assets/img/personnel/goback-hover.png) center center no-repeat;
}
.title {
  font-size: 18px;
  color: #000;
  padding: 0;
  height: 46px;
  line-height: 46px;
  margin-top: 0;
  float: left;
}
</style>
