<template>
  <div @click="hideSubOpertaion" class="sys rolelist sysRoleList">
    <div id="navbar">
      <el-row class="navRow">
        <el-col :span="10">
          <span class="icon" @click="goBack"></span>
          <span class="title">资源管理</span>
        </el-col>
        <el-col :span="4">
          <el-input
              class="searchBox"
              placeholder="搜索"
              v-model="queryKey"
              width="100%"
              @click="retrieveData"
              @keyup.enter.native="retrieveData">
              <el-button slot="append" icon="el-icon-search"
              @click="retrieveData"></el-button>
            </el-input>
        </el-col>
        <el-col :span="8" style="text-align:center">
          <el-button type="primary" @click="showCreateDialog">新建</el-button>
          <!-- <el-button @click="deleteAll">删除</el-button> -->
          <el-button @click="retrieveData">刷新</el-button>
        </el-col>
      </el-row>
      </div>
      <div class="tableDiv">
        <el-table
        :data="tableData"
        style="width:100%"
        border
        v-loading.body="loading"
        @selection-change="handleSelectionChange">
        <!-- <el-table-column
          prop="checked"
          type="selection">
        </el-table-column> -->
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="DataID"
          label="字典代码">
        </el-table-column>
        <el-table-column
          prop="DataName"
          label="字典名称">
        </el-table-column>
        <el-table-column
          prop="DataValue"
          label="字典值">
        </el-table-column>
        <el-table-column
          prop="DataValueInt"
          label="字典值-int型">
        </el-table-column>
        <el-table-column
          label="是否启用">
          <template slot-scope="scope">
            {{scope.row.Tag === '1' ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="GroupName"
          label="字典分组标识">
        </el-table-column>
        <el-table-column
          prop="DataType"
          label="字典分类">
        </el-table-column>
        <el-table-column
          prop="DataMemo"
          label="字典说明">
        </el-table-column>
        <!-- <el-table-column
          width="120"
          align="center"
          label="是否启用">
          <template scope="scope">
            <div v-if="scope.row.Tag === '1'" style="text-align:center;">是</div>
            <div v-else style="text-align:center;">否</div>
          </template>
        </el-table-column> -->
        <el-table-column
            label="操作"
            width="80">
            <template slot-scope="scope">
              <span>
                <!-- <el-button
                  type="primary"
                  size="mini"
                  title="查看"
                  icon="el-icon-view"
                  @click="watchCallback(scope.row)">
                </el-button> -->
                <el-button
                 type="primary"
                  size="mini" 
                  title="编辑"
                  icon="el-icon-edit" 
                  @click="editCallback(scope.row)">
                </el-button>

                <!-- <el-button 
                  type="primary" 
                  size="mini" 
                  title="添加组织"
                  icon="el-icon-menu" 
                  @click="showMenuConfig(scope.row.RoleID)">
                </el-button> -->
                
              </span>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row class="white-bg padding-10">
      <div class="footerbar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-row>
    <menuDialog
      :roleId="menuRoleId"
      :dialogVisible="menuDialogVisible"
      v-if="menuDialogVisible"
      @addSuccess="addMenuSuccess"
      @addCancel="addMenuCancel">
    </menuDialog>
    <createDialog
      :dialogVisible="createDialogVisible"
      v-if="createDialogVisible"
      @createSuccess="createSuccess"
      @createCancel="createRoleCancel">
    </createDialog>
    <editDialog
      :dialogVisible="editDialogVisible"
      v-if="editDialogVisible"
      :dictForm="dictForm"
      :title="'编辑角色信息'"
      @createSuccess="editRoleSuccess"
      @createCancel="editRoleCancel">
    </editDialog>
    <el-dialog
      title="删除角色"
      :visible="deleteDialogVisible"
      class="deleteDialog"
      :showClose="false">
      <span>角色下对应的菜单、人员关系将会一并删除，是否确认删除？</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCancelDelete">否</el-button>
        <el-button @click="handleConfirmDelete">是</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import menuDialog from './menuDialog.vue'
import createDialog from './createDialog.vue'
import editDialog from './editDialog.vue'
export default {
  data () {
    return {
      dictMap: {},
      tableData: [],
      showmenu: -1,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      menuDialogVisible: false,
      menuRoleId: null,
      queryKey: '',
      multiSelection: [],
      dictForm: null,
      viewRole: null,
      deleteDialogVisible: false,
      createDialogVisible: false,
      editDialogVisible: false,
      viewDialogVisible: false,
      loading: true
    }
  },
  mounted () {
    this.retrieveData()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 查询字典
    retrieveData () {
      this.loading = true
      let params = {
        page: this.currentPage,
        pagesize: this.pageSize,
        DataID: this.queryKey
      }
      this.$request.post(`/sys/index/getAllData`, params).then(res => {
        this.loading = false
        let data = res.data
        this.totalCount = data.count
        this.tableData = data.data
      }, err => {
        console.log(err)
        this.loading = false
      })
    },
    // 返回
    goBack () {
      this.$router.go(-1)
    },
    // 创建成功回调
    createSuccess () {
      this.createDialogVisible = false
      this.retrieveData()
    },
    createRoleCancel () {
      this.createDialogVisible = false
    },
    // 打开新建
    showCreateDialog () {
      this.createDialogVisible = true
    },
    deleteAll () {
      this.deleteDialogVisible = true
    },
    watchCallback (role) {
      this.viewRole = role
      this.viewDialogVisible = true
    },
    editCallback (role) {
      this.dictForm = Object.assign({}, role)
      this.editDialogVisible = true
    },
    editRoleSuccess () {
      this.editDialogVisible = false
      this.retrieveData()
    },
    editRoleCancel () {
      this.editDialogVisible = false
    },
    viewRoleCancel () {
      this.viewDialogVisible = false
    },
    showMembers (roleId) {
      this.$router.push({
        path: `/sys/rolemembers/${roleId}`
      })
    },
    handleCancelDelete () {
      this.deleteDialogVisible = false
    },
    handleConfirmDelete () {
      if (this.multiSelection.length > 0) {
        console.log(this.multiSelection)
        let roleIds = []
        for (let role of this.multiSelection) {
          if (role.type === 'System') {
            return this.$message({
              type: 'error',
              message: '您所选的角色中有系统内置角色，无法删除，请您重新选择！',
              duration: 3000
            })
          } else {
            roleIds.push(role.id)
          }
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请您选择角色'
        })
        this.deleteDialogVisible = false
      }
    },
    deleteCallback (role) {
      this.multiSelection = [role]
      this.deleteDialogVisible = true
    },
    handleSelectionChange (val) {
      this.multiSelection = val
    },
    roleTypeFormatter (row, column) {
      return this.dictMap[row.roleType]
    },
    hideSubOpertaion () {
      this.showmenu = -1
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.retrieveData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.retrieveData()
    },
    showMenuConfig (roleId) {
      this.menuRoleId = roleId
      this.menuDialogVisible = true
    },
    addMenuSuccess () {
      this.menuRoleId = null
      this.menuDialogVisible = false
    },
    addMenuCancel () {
      this.menuRoleId = null
      this.menuDialogVisible = false
    }
  },
  created () {
  },
  components: {
    menuDialog, createDialog, editDialog
  }
}
</script>
<style lang="scss" scoped>
.footerbar {
  float: right;
  text-align: right;
}
  #navbar {
    width: 100%;
    vertical-align:middle;
    margin-bottom: 10px;
    .navRow {
      background: white;
      padding: 10px 0 0 0;
      margin-top: 10px;
    }
  }
  .suboperation {
    border-radius: 4px;
    position: absolute;
    cursor: pointer;
    width: 100px;
    height: 78px;
    text-align: center;
    z-index: 1000;
    top: 35px;
    background-color: white;
    box-shadow: 3px 3px 3px rgba(0,0,0,.1);
    border: 1px solid #dedede;
    li {
      margin-top: 5px;
    }
    li:hover{
      background: #eee;
    }
  }
  .inline-menu {
    display: inline-block;
  }
  .watch {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(../../assets/img/dataDictionary/spirit.png)  no-repeat;
    background-position: -10px -78px;
    cursor: pointer;
  }
  .el-icon-caret-bottom{
    cursor: pointer;
  }
  .watch:hover {
    background-position: -38px -78px;
  }

  .edit {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(../../assets/img/dataDictionary/spirit.png)  no-repeat;
    background-position: -10px -53px;
    cursor: pointer;
  }
  .edit:hover {
    background-position: -38px -53px;
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
  .icon {
    background: url(../../assets/img/personnel/goback.png) center center no-repeat;
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
  .sysRoleList .tableDiv{
    background: white;
    position: relative;
    padding: 10px 20px;
  }
</style>

