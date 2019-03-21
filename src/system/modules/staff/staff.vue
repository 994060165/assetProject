<template>
  <div>
    <el-row class="padding-10 white-bg">
      <el-col :span="8">
        <el-button type="primary" @click="create">新建</el-button>
        <!-- <el-button @click="batchRemove(sels)">删除</el-button> -->
        <el-button @click="refresh">刷新</el-button>
      </el-col>
      <el-col :span="8" class="pull-right">
        <el-input placeholder="搜索" v-model="queryKey" @keyup.enter.native="searchUserButton">
          <template slot="append">
            <el-button slot="append" icon="el-icon-search" @click="searchUserButton"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row class="m-t-10 white-bg padding-10">
			<el-table
				ref="multipleTable"
				:data="tableData"
				tooltip-effect="dark"
				style="width: 100%"
				align="center"
				@selection-change="handleSelectionChange"
        v-loading="loading2">
				<!-- <el-table-column
					type="selection"
					align="center"
					width="55">
				</el-table-column> -->
        <el-table-column type="index" width="100" label="序号">
        </el-table-column>
				<el-table-column
          prop="UserName"
					label="姓名"
					align="center"
					width="120">
				</el-table-column>
				<el-table-column
					prop="UserID"
					align="center"
					label="用户ID"
					show-overflow-tooltip>
				</el-table-column>
				<el-table-column
					prop="UserEmail"
					align="center"
					label="邮箱">
				</el-table-column>
				<el-table-column
					prop="UserMobile"
					align="center"
					label="手机号码"
					show-overflow-tooltip>
				</el-table-column>
				<el-table-column
					align="center"
					label="操作">
					<template slot-scope="scope">
             <!--修改-->
						<el-button title="修改" size="mini" type="primary" icon="el-icon-edit" @click="modify(scope.row)">
            </el-button>
            <!--删除-->
						<el-button title="删除" size="mini" type="warning" icon="el-icon-delete" @click="deleteDicts(scope.row)">
            </el-button>
           <!--配置角色-->
            <el-button title="配置角色" size="mini" type="success" icon="el-icon-setting"  @click="addRole(scope.row)"></el-button>
           <!--重置密码-->
            <el-button title="重置密码" size="mini" type="danger" icon="el-icon-refresh"  @click="resetPsw(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>
    <el-row class="padding-10 white-bg">
      <el-col :span="8">
        <!-- <el-checkbox v-model="checked" v-on:change="toogleSelection()"></el-checkbox>
        <el-button type="danger" @click="batchRemove(sels)" :disabled="this.sels.length===0">批量删除</el-button> -->
      </el-col>
      <el-col :span="12" class="pull-right text-right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="pageSize"
          :small="true"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <el-row>
      <createUser
        :editUser="editUser"
        :form = "staffForm"
        :formVisible = "dialogFormVisible"
        v-if="dialogFormVisible"
        :tableTitle="tableTitle"
        @addCancel = "resetForm">
      </createUser>
    </el-row>
    <el-row>
      <roleDialog
        v-if="roledialogVisible"
        :roledialogVisible="roledialogVisible"
        :roleUserID="roleUserID"
        @addsuccess="roleCancle"
        @addCancel="roleCancle">
      </roleDialog>
    </el-row>
    <el-row>
      <restUser
      v-if="restUserVisible"
      :formVisible="restUserVisible"
      :form="restUserForm"
      @addCancel="restUserCancle">
      </restUser>
    </el-row>
  </div>

</template>

<script>
  import {TokenAPI} from '@/request/TokenAPI'
  import { deleteByIds } from '../../service/personnel'
  import createUser from './createUser'
  import roleDialog from './roleDialog'
  import restUser from './restUser'
  export default {
    name: 'hello',
    data () {
      return {
        // 重置密码弹窗显隐
        restUserVisible: false,
        restUserForm: {},
        // 角色弹窗显隐
        roledialogVisible: false,
        roleUserID: '',
        // 编辑人员信息显隐
        dialogFormVisible: false,
        formdisabled: false,
        editUser: false,
        tableTitle: '创建新用户',
        modifyDisable: false,
        createDisable: false,
        informationFormVisible: false,
        staffForm: {},
        params: {
          sex: '1',
          education: '1',
          degree: '1',
          status: '1'
        },
//        信息列表
        loading2: false,
        queryKey: '',
        isCollapsed: true,
        total: 0,
        pageSize: 10,
        page: 1,
        currentPage: 1,
        checked: false,
        listLoading: false,
        tableData: [],
        sels: [],
        token: TokenAPI.getToken()
      }
    },
    mounted () {
    },
    created () {
      this.getDictList()
    },
    watch: {

    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      // 获取人员信息
      getDictList () {
        this.searchUsers()
      },
      // 是否显示输入框
      isCollapse () {
        this.isCollapsed = true
      },
      // 输入框点击×号
      handleIconClick () {
        this.isCollapsed = false
      },
      // 刷新
      refresh () {
        this.page = 1
        this.queryKey = ''
        this.getDictList()
      },
      // 刷新
      searchUserButton () {
        this.page = 1
        this.searchUsers()
      },
      // 创建
      create () {
        this.formdisabled = false
        this.editUser = false
        this.modifyDisable = true
        this.createDisable = false
        this.dialogFormVisible = true
        this.tableTitle = '创建新用户'
      },
      // 删除
      deleteDicts (row) {
        this.$confirm('人员对应的登录、角色、机构关联信息将一并删除，是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteByIds(row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 搜索方法
      searchUsers () {
        this.loading2 = true
        let params = {
          UserID: this.queryKey,
          page: this.page,
          pagesize: this.pageSize
        }
        this.$request.post('/sys/index/getAlluser', params).then(res => {
          let data = res.data
          if (res.data) {
            this.tableData = data.data
            this.total = data.count
            this.loading2 = false
          }
        }, err => {
          console.log(err)
          this.loading2 = false
        })
      },
      // 修改选择行
      handleSelectionChange (sels) {
        if (sels.length === this.tableData.length) {
          this.checked = true
        } else {
          this.checked = false
        }
        this.sels = sels
        let selsArr = []
        for (var i = 0; i < sels.length; i++) {
          selsArr = selsArr.concat(sels[i].id)
        }
      },
      // 分页当前页改变时的函数
      handleCurrentChange (val) {
        this.page = val
        this.getDictList()
      },
      // pageSize发生改变时触发
      handleSizeChange () {

      },
      // 取消添加
      roleCancle () {
        this.roledialogVisible = false
        this.roleUserID = ''
      },
      // 切换选择列
      toogleSelection (sels) {
        if (this.sels.length === this.tableData.length) {
          this.$refs.multipleTable.clearSelection()
//          this.checked = false
        } else if (this.sels.length < this.tableData.length) {
//          this.checked = true
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        }
      },
      // 批量删除
      batchRemove (sels) {
        if (sels.length === 0) {
          this.$message('请至少选择一项')
        } else {
          this.$confirm('是否确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let selsArr = []
            for (var i = 0; i < sels.length; i++) {
              selsArr = selsArr.concat(sels[i].id)
            }
            deleteByIds(selsArr).then(data => {
              this.$message('删除成功')
              setTimeout(() => {
                this.getDictList()
              }, 500)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
//      修改
      modify (index) {
        this.dialogFormVisible = true
        this.editUser = true
        this.createDisable = true
        this.formdisabled = false
        this.modifyDisable = false
        this.tableTitle = '编辑用户'
        this.staffForm = Object.assign({}, index)
      },
//      删除
      deleteByIds (row) {
        // let deleteInfo = row
        // let deleteId = [ deleteInfo.UserID ]
        let params = {
          token: this.token,
          UserID: row.UserID
        }
        this.$request.post(`/sys/index/deleteUser`, params).then(res => {
          let data = res.data
          if (data.ID !== '-1') {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getDictList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        }, () => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        })
      },
      // deleteByIds (index) {
      //   let deleteInfo = index
      //   let deleteId = [ deleteInfo.id ]
      //   deleteByIds(deleteId).then(data => {
      //     this.$message('删除成功')
      //     setTimeout(() => {
      //       this.getDictList()
      //     }, 500)
      //   })
      // },
//      取消
      resetForm (formName) {
        this.dialogFormVisible = false
        this.staffForm = {}
      },
      // 取消重置密码
      restUserCancle () {
        this.restUserVisible = false
        this.restUserForm = ''
      },
//      重置密码
      resetPsw (row) {
        this.restUserVisible = true
        this.restUserForm = Object.assign({}, row)
      },
      // 添加角色
      addRole (row) {
        // this.roleUserID = row.UserID
        // this.roledialogVisible = true
        this.$router.push({path: `/sys/roleByUser/${row.UserID}`})
      }
    },
    components: {
      createUser, roleDialog, restUser
    }
  }
</script>


