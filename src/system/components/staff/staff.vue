<template>
  <div>
    <div class="my-staff">
      <div class="temp-cb el-c-master-light">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/sys'}">系统管理</el-breadcrumb-item>
          <span class="el-c-primary">人员管理</span>
        </el-breadcrumb>
		  </div>
    <div class="com-select">
			<el-form :inline="true" label-width="50px" onsubmit="return false;">
				<!-- <el-form-item label="性别:">
					<el-select class="w-71" v-model="params.sex">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<!-- <el-form-item label="学位:">
					<el-select class="w-71" v-model="params.degree">
						<el-option
							v-for="item in degree"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学历:">
					<el-select class="w-71" v-model="params.education">
						<el-option
							v-for="item in education"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态:">
					<el-select class="w-100" v-model="params.status">
						<el-option
							v-for="item in status"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item class="pull-right">
          <el-input icon="search" placeholder="搜索" v-model="queryKey"
                @keyup.enter.native="searchDict" :on-icon-click="searchDict">
					</el-input>
				</el-form-item>

				<!-- <el-form-item >
					<el-input class="w-260" suffix-icon="el-icon-search" placeholder="搜索" v-model="queryKey">
						<el-button slot="append" @click="searchDict"><i  class="cursor iconfont icon-search"></i></el-button>
					</el-input>
				</el-form-item> -->
			</el-form>
		</div>

    <div class="next-title">
			<el-button type="primary" @click="create">新建</el-button>
			<el-button @click="batchRemove(sels)">删除</el-button>
			<el-button @click="refresh">刷新</el-button>
      <!-- <li class="sort">
          <div class="sortable" style="display: inline-block" @click="sortVisiableFun">
            排序<span class="el-icon-caret-bottom" ></span>
          </div>
          <ul class="sortOptions" v-show="sortVisiable">
            <li>
              <span>真实姓名</span>
              <em >
                <span class="up"></span>
                <span class="down"></span>
              </em>
              </li>
              <li>
                <span>手机号码</span>
                <em >
                  <span class="up"></span>
                  <span class="down"></span>
                </em>
              </li>
          </ul>
        </li> -->
		</div>

    <div class="table-com">
			<el-table
				ref="multipleTable"
				:data="tableData"
				tooltip-effect="dark"
				style="width: 100%"
				align="center"
				@selection-change="handleSelectionChange"
        v-loading="loading2">
				<el-table-column
					type="selection"
					align="center"
					width="55">
				</el-table-column>
        <el-table-column type="index" width="100" label="序号">
        </el-table-column>
				<el-table-column
          prop="userName"
					label="姓名"
					align="center"
					width="120">
				</el-table-column>
				<el-table-column
					prop="mail"
					align="center"
					label="邮箱">
				</el-table-column>
				<el-table-column
					prop="mobile"
					align="center"
					label="手机号码"
					show-overflow-tooltip>
				</el-table-column>
				<!-- <el-table-column
					prop="deptName"
					align="center"
					label="所属部门"
					show-overflow-tooltip>
				</el-table-column> -->
				<el-table-column
					align="center"
					label="操作"
					>
					<template scope="scope">
             <!--修改-->
						<el-button title="修改" size="mini" type="primary" @click="modify(scope.row)">
              <i class="iconfont icon-bianji"></i>
            </el-button>
            <!--删除-->
						<el-button title="删除" size="mini" type="warning" @click="deleteDicts(scope.row)">
              <i class="iconfont icon-shanchu"></i>
            </el-button>
             <!--查看-->
             <el-button title="查看" size="mini" class="com-icon-s" @click="queryInfo(scope.row)">
              <i class=" iconfont icon-search "></i>
            </el-button>
            <!--登录信息-->
            <el-button title="登录信息" class="information_opr" @click="informationInfo(scope.row)"></el-button>
           <!--配置角色-->
            <el-button title="配置角色" class="configure_opr"  @click="showMembers(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
      <div class="batch_del_select">
        <el-checkbox v-model="checked" v-on:change="toogleSelection()"></el-checkbox>
        <el-button type="danger" @click="batchRemove(sels)" :disabled="this.sels.length===0">批量删除</el-button>
      </div>
			<div class="pagination-com">
        <el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page.sync="currentPage"
					:page-size="pageSize"
					:small="true"
					layout="total, prev, pager, next, jumper"
					:total="total">
				</el-pagination>
			</div>
		</div>
  </div>

  <div>
      <!--弹出框-->
      <div class="dialog_box">
        <el-dialog title="人员信息" :visible.sync="dialogFormVisible">
          <el-form :model="staffForm" ref="staffForm" label-width="100px" class="demo-ruleForm">
            <el-form-item prop="userName" label="姓名" :rules="[
                { required: true, message: '请输入姓名', trigger: 'blur' }
              ]">
              <el-input v-model="staffForm.userName" placeholder="【唯一、必填】" :disabled="formdisabled"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="gender">
              <el-select v-model="staffForm.gender" placeholder="请选择" :disabled="formdisabled">
                <!-- <el-option label="请选择" value=""></el-option> -->
                <el-option label="男性" value="M"></el-option>
                <el-option label="女性" value="F"></el-option>
                <!-- <el-option label="未说明的性别" value="U"></el-option>
                <el-option label="不详" value="其他"></el-option> -->
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="民族" prop="ethnicGroup">
              <el-select v-model="ruleForm.ethnicGroup" placeholder="请选择" :disabled="formdisabled">
                <el-option label="请选择" value="selectethnicGroup"></el-option>
                <el-option label="汉族" value="HA"></el-option>
                <el-option label="外国民族" value="93"></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="身份证号：" prop="personalId">
              <el-input v-model="ruleForm.personalId" :disabled="formdisabled"></el-input>
            </el-form-item> -->

            <el-form-item prop="mobile" label="手机号" :rules="[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
              ]">
              <el-input v-model="staffForm.mobile" placeholder="【唯一、必填】" :disabled="formdisabled"></el-input>
            </el-form-item>

            <el-form-item prop="mail" label="邮箱" :rules="[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
              ]">
              <el-input v-model="staffForm.mail" placeholder="【唯一、必填】" :disabled="formdisabled"></el-input>
            </el-form-item>

            <!-- <el-form-item label="办公电话：" prop="officeTel">
              <el-input v-model="ruleForm.officeTel" placeholder="【010-88888888 或 手机号码】" :disabled="formdisabled"></el-input>
            </el-form-item>
            <el-form-item label="学历：" prop="eduBackground">
              <el-input v-model="ruleForm.eduBackground" :disabled="formdisabled"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="行政职务：" prop="position">
              <el-input v-model="ruleForm.position" :disabled="formdisabled"></el-input>
            </el-form-item> -->

            <!-- <el-form-item label="参加工作时间">
              <el-col :span="11">
                <el-form-item prop="joinDate">
                  <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.joinDate" style="width: 100%;" :disabled="formdisabled"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item> -->

            <el-form-item class="dialog_bottom">
              <el-button type="primary" @click="submitForm('staffForm')" :class="{ modifyDisable: modifyDisable }">修改保存</el-button>
              <el-button type="primary"  @click="saveStaff('staffForm')" :class="{ createDisable: createDisable }">新建保存</el-button>
              <el-button @click="resetForm('staffForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!--登录配置信息-->
      <div class="information_box">
        <el-dialog title="人员登录信息" :visible.sync="informationFormVisible">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item prop="emailWork" label="邮箱" :rules="[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
              ]">
              <el-input v-model="ruleForm.emailWork" placeholder="【唯一、必填】" :disabled="formdisabled"></el-input>
            </el-form-item>
            <el-form-item prop="mobNum" label="手机号" :rules="[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
              ]">
              <el-input v-model="ruleForm.mobNum" placeholder="【唯一、必填】" :disabled="formdisabled"></el-input>
            </el-form-item>
            <el-form-item prop="userName" label="姓名" :rules="[
                { required: true, message: '请输入姓名', trigger: 'blur' }
              ]">
              <el-input v-model="ruleForm.userName" placeholder="【唯一、必填】" :disabled="formdisabled"></el-input>
            </el-form-item>
            <el-form-item label="用户状态：" prop="gender">
              <el-select v-model="ruleForm.userStatus" placeholder="请选择" :disabled="formdisabled">
                <el-option label="请选择" value=""></el-option>
                <el-option label="启用" value="string:ACT" selected="selected">启用</el-option>
                <el-option label="封存/停用" value="string:NA">封存/停用</el-option>
                <el-option label="审核中" value="string:CHK">审核中</el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="dialog_bottom information_bottom">
              <el-button type="primary" @click="submitForm('ruleForm')" :class="{ modifyDisable: modifyDisable }">保存</el-button>
              <el-button @click="editinformation('ruleForm')">编辑</el-button>
              <el-button type="primary" @click="resetPsw(ruleForm.id)" :class="{ modifyDisable: modifyDisable }">重置密码</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>

</template>

<script>
  import { getpersonnel, updateEntity, deleteByIds, saveStaffInfo, queryLoginByUserId, resetPsw } from '../../service/personnel'
  export default {
    name: 'hello',
    data () {
      return {
//        对话框
        dialogFormVisible: false,
        formdisabled: false,
        modifyDisable: false,
        createDisable: false,
        informationFormVisible: false,
        staffForm: {
          userName: '',
          gender: 'M',
          ethnicGroup: '',
          personalId: '',
          mobile: '',
          mail: '',
          officeTel: '',
          eduBackground: '',
          position: '',
          joinDate: '',
          userStatus: ''
        },
        params: {
          sex: '1',
          education: '1',
          degree: '1',
          status: '1'
        },
        options: [{
          value: '1',
          label: '男'
        },
        {
          value: '2',
          label: '女'
        }],
        degree: [{
          value: '1',
          label: '大学'
        },
        {
          value: '2',
          label: '高中'
        }],
        education: [{
          value: '1',
          label: '全部'
        },
        {
          value: '2',
          label: '学士'
        }],
        status: [{
          value: '1',
          label: '全部'
        },
        {
          value: '2',
          label: '待审核'
        }],
        ruleForm: {
          userName: '',
          gender: 'M',
          ethnicGroup: '',
          personalId: '',
          mobile: '',
          mail: '',
          officeTel: '',
          eduBackground: '',
          position: '',
          joinDate: '',
          userStatus: ''
        },
//        信息列表
        loading2: false,
        queryKey: '',
        isCollapsed: true,
        sortVisiable: false,
//        informationVisiable: false,
        total: 0,
        pageSize: 10,
        page: 1,
        currentPage: 1,
        checked: false,
        showOverflow: false,
        listLoading: false,
        tableData: [{
          userName: '',
          mail: '',
          mobile: '',
          deptName: '',
          id: ''
        }],
        sels: [],
        selectionModule: []
      }
    },
    mounted () {
//      let docu = document.getElementsByClassName('el-cascader__label')
//      docu[0].style.lineHeight = '55px'
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
        this.loading2 = true
        let params = `orderKey=&page=${this.page}&pageSize=${this.pageSize}&queryKey=${this.queryKey}`
        getpersonnel(params).then(res => {
          this.total = parseInt(res.headers.count)
          this.tableData = res.data
        })
        setTimeout(() => {
          this.loading2 = false
        }, 1800)
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
        this.getDictList()
      },
      // 创建
      create (formName) {
        console.log(formName)
        this.formdisabled = false
        this.modifyDisable = true
        this.createDisable = false
        this.dialogFormVisible = true
        this.$refs[formName].resetFields()
      },
      // 删除
      deleteDicts (index) {
        this.$confirm('人员对应的登录、角色、机构关联信息将一并删除，是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteByIds(index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 搜索方法
      searchDict () {
        // 获取人员信息
        this.loading2 = true
        let params = `orderKey=&page=${this.page}&pageSize=${this.pageSize}&queryKey=${this.queryKey}`
        getpersonnel(params).then(res => {
          this.total = parseInt(res.headers.count)
          this.tableData = res.data
        })
        setTimeout(() => {
          this.loading2 = false
        }, 1800)
      },
      // 控制排序是否显示
      sortVisiableFun () {
        this.sortVisiable = !this.sortVisiable
      },
//      登录配置信息显示
//      informationVisiableFun (index) {
//        this.informationVisiable = false
//      },
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
        this.createDisable = true
        this.formdisabled = false
        this.modifyDisable = false
        this.staffForm = Object.assign({}, index)
      },
//      删除
      deleteByIds (index) {
        let deleteInfo = index
        let deleteId = [ deleteInfo.id ]
        deleteByIds(deleteId).then(data => {
          this.$message('删除成功')
          setTimeout(() => {
            this.getDictList()
          }, 500)
        })
      },
//      查看
      queryInfo (index) {
        this.dialogFormVisible = true
        this.formdisabled = true
        this.createDisable = true
        this.modifyDisable = true
        this.staffForm = Object.assing({}, index)
      },
//      新建保存
      saveStaff (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let staff = Object.assign({}, this.staffForm)
            saveStaffInfo(staff).then(data => {
              this.$message('成功')
              setTimeout(() => {
                this.getDictList()
              }, 500)
              this.$refs[formName].resetFields()
              this.dialogFormVisible = false
            }, response => {
              console.log('新建失败了！！！！！！！！！！！！！！！！！！！！！！')
            })
          } else {
            return false
          }
        })
      },
//      修改保存
      submitForm (formName) {
        console.log(2, this.staffForm)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let staff = Object.assign({}, this.staffForm)
            updateEntity(staff).then(data => {
              this.$message('修改成功')
              setTimeout(() => {
                this.getDictList()
              }, 500)
            })
            this.dialogFormVisible = false
            this.informationFormVisible = false
            this.$refs[formName].resetFields()
          } else {
            this.$message('保存失败')
            return false
          }
        })
      },
//      取消
      resetForm (formName) {
        this.dialogFormVisible = false
//        this.$refs[formName].resetFields()
      },
//      登录信息
      informationInfo (index) {
        this.modifyDisable = true
        this.informationFormVisible = true
        this.formdisabled = true
        let informationdeleteInfo = this.ruleForm = index
        informationdeleteInfo = {userId: informationdeleteInfo.userId}
        queryLoginByUserId(informationdeleteInfo).then(res => {
          this.ruleForm = res
        })
      },
//      编辑登录信息
      editinformation (formName) {
        this.formdisabled = false
        this.modifyDisable = false
      },
//      重置密码
      resetPsw (resetid) {
        let params = {
          id: resetid
        }
        this.$confirm('是否确认重置密码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetPsw(params).then(data => {
            this.$message('重置成功')
            setTimeout(() => {
              this.getDictList()
            }, 500)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
//      showMembers (userId) {
//        this.$router.push({
//          path: `/oa/Home/configure/${userId}`
//        })
//      }
      showMembers (index) {
        let userid = index.userId
        this.$router.push({
          name: `configure`,
          params: {
            id: userid
          }
        })
      }
    },
    components: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/sass" lang="sass">
	.my-staff
		.el-table__body-wrapper
			.el-table__row
				td:nth-last-child(1)
					.cell
						visibility: hidden!important

	.my-staff
		.el-table__body-wrapper
			.el-table__row:hover
				td:nth-last-child(1)
					.cell
						visibility: visible!important

		.el-table__header-wrapper th
			border-right: 1px solid #e1e1e1
			border-bottom: none!important

		.el-table__header-wrapper th:nth-last-child(2)
			border-right: none!important
		.pagination-com .el-pagination__total
			margin-top: -3px

		.pagination-com .el-pagination__sizes
			margin-top: -3px
		.com-select .el-form-item
			margin-bottom: 0 !important
			margin-right: 20px
</style>

<style scoped rel="stylesheet/sass" lang="sass">
	.my-staff
		background-color: #fff
	.temp-cb
		font-size: 12px
		position: absolute
		top: 73px
		left: 200px

	.com-icon-s
		background-color: #c03eea
		color: #fff

	.com-auto
		position: absolute
		top: 10px
		left: 50%
		margin-left: -165px

	.cursor
		cursor: pointer
	.font-size-12
		font-size: 12px
	.pagination-com
		text-align: right
		margin-top: 20px
		margin-bottom: 20px

	.w-71
		width: 71px
	.table-com
		padding: 10px

	.next-title
		padding: 10px 0
		background: #e8ebf1

	.icon-com
		width: 20px
		height: 20px
	.w-260
		width: 260px
	.com-select
		padding: 10px 15px
		height: 35px
		position: relative
	.w-70
		width: 70px
</style>

<style scoped lang="scss">
  .information_opr{
    background: url(../../assets/img/personnel/information.png) center center no-repeat;
  }
  .configure_opr{
    background: url(../../assets/img/personnel/configureImg.png) center center no-repeat;
  }
  .batch_del_select{
		margin-top: 20px;
		margin-bottom: 20px;
    float: left;
  }
  .dialog_box{
      width: 1400px;
      margin: 20px auto;
      .el-dialog__title{
        line-height: 1;
        font-size: 16px;
        font-weight: 700;
        color: #1f2d3d;
        margin-left: 42%;
      }
      .el-form-item{
        float: left;
        width: 300px;
        margin-right: 80px;
      }
      .dialog_bottom{
        margin-left: 30%;
      }
      .modifyDisable,.createDisable{
        display: none;
      }
    }
  .information_box{
     width: 600px;
    margin: 20px auto;
    .el-dialog__title{
      line-height: 1;
      font-size: 16px;
      font-weight: 700;
      color: #1f2d3d;
      margin-left: 42%;
    }
    .el-form-item{
      float: left;
      width: 300px;
      margin-right: 80px;
    }
    .information_bottom{
      margin-left: 25%;
      width: 400px;
    }
    .modifyDisable,.createDisable{
      display: none;
    }
  }

.sort {
    float: right;
    padding-right: 10px;
    position: relative;
    width: 100px;
    cursor: default;
    i {
      display: block;
      width: 8px;
      height: 8px;
      color: #ababab;
      position: absolute;
      left: 48px;
      cursor: pointer;
    }
    .up {
      top: 12px;
    }
    .down {
      bottom: 16px;
    }
    .sortable {
      cursor: pointer;
    }
    .sortOptions {
      width: 160px;
      max-height: 140px;
      overflow: hidden;
      padding: 0;
      border: 1px solid #dedede;
      box-shadow: 3px 3px 5px #e6e6e6;
      position: absolute;
      top: 50px;
      z-index: 10;
      background-color: #fff;
      border-top: none;
      left: -30px;
      font-size: 14px;
      li {
        float: left;
        width: 148px;
        height: 26px;
        line-height: 26px;
        span {
          display: inline-block;
          max-width: 100px;
          float: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        em {
          display: inline-block;
          font-style: normal;
          width: 48px;
          height: 20px;
          padding-top: 4px;
          float: right;
          span {
            display: inline-block;
            width: 16px;
            height: 16px;
            color: #ababab;
            border: 1px solid #ababab;
            margin-left: 5px;
          }
          .up {
            background: url(../../assets/img/personnel/i-up.png) center center no-repeat;
          }
          .up:hover {
            background: url(../../assets/img/personnel/i-up-2.png) center center no-repeat;
          }
          .down {
            background: url(../../assets/img/personnel/i-down.png) center center no-repeat;
          }
          .down:hover {
            background: url(../../assets/img/personnel/i-down-2.png) center center no-repeat;
          }
        }
      }
    }
  }
</style>
