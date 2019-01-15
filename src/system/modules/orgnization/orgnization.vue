<template>
  <div class="sys-org-tree">
    <div class="commonpage sysOrgnization">
      <el-row class="bg_white height-36 padding_20">
        <el-button @click.native="addDept" type="primary">增加机构/单位</el-button>
      </el-row>
      <el-row class="bg_white org_row">
        <el-col :span="8" class="padding_20">
          <!-- :filter-node-method="filterNode" -->
          <ul>
            <li v-for="(dept, index) in deptDatas"
                :key="index"
                class="deptLi"
                :class="{'active': index === activeIndex }"
                @click="deptClick(dept, index)">
              {{dept.OrgName}}
            </li>
          </ul>
        </el-col>
        <el-col :span="16" class="padding_20">
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="人员信息" name="first">
              <el-row>
                <el-table :data="deptPerson" tooltip-effect="dark" v-loading="listLoading" :stripe="true">
                  <el-table-column prop="UserName" label="姓名">
                  </el-table-column>
                  <el-table-column prop="UserMobile" label="手机">
                  </el-table-column>
                  <el-table-column prop="UserEmail" label="邮箱">
                  </el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                      <!-- <el-button title="查看" class="opr document_opr" @click="queryInfo(scope.row)">
                        <i class=" fa fa-search-plus "></i>
                      </el-button> -->
                      <el-button type="primary" icon="el-icon-delete" @click="removeMember(scope.row)">
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row class="padding_20">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="page.page"
                  :page-size="page.pageSize"
                  :small="true"
                  :page-sizes="[5, 10, 20, 50]"
                  layout="sizes, total, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="机构/单位信息" name="second">
              <el-form :model="deptInfo" ref="deptForm" label-width="140px">
                <el-col :span="12">
                  <el-form-item label="机构名称：">
                    <div v-text="deptInfo.OrgName"></div>
                  </el-form-item>
                  <!-- <el-form-item label="机构地址：" prop="adress" >
                    <div v-text="deptInfo.adress"></div>
                  </el-form-item> -->
                  <el-form-item label="机构说明：">
                    <div v-text="deptInfo.Detail"></div>
                  </el-form-item>
                  <!-- <el-form-item label="机构联系邮箱：" prop="email" >
                    <div v-text="deptInfo.email"></div>
                  </el-form-item> -->
                </el-col>
                <el-col :span="12">
                  <el-form-item label="机构名称：">
                    <div v-text="deptInfo.OrgID"></div>
                  </el-form-item>
                  <!-- <el-form-item label="机构联系人：" prop="userName">
                    <div v-text="deptInfo.userName"></div>
                  </el-form-item>
                  <el-form-item label="机构联系电话：">
                    <div v-text="deptInfo.tel"></div>
                  </el-form-item>
                  <el-form-item label="机构管理员账号：" prop="zhanghao" >
                    <div v-text="deptInfo.zhanghao"></div>
                  </el-form-item> -->
                </el-col>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <el-row class="bg_white height-36 padding_20 margin_10">
            <el-button @click="addPerson" type="primary">增加人员</el-button>
            <el-button @click="deleteDept" type="delete">删除机构/单位</el-button>
          </el-row>
        </el-col>
      </el-row>
      <!-- <div class="tree" ></div> -->
      <!-- <div class="right" id="right" ref="right" :class="{ isFixed: isFixed }">
        
      </div> -->
    </div>
      <!-- <div class="right_top">
        <el-menu default-active="2" class="el-menu-vertical-demo right_top_box">
          <el-menu-item index="2" @click="gotableOne()"><i class=""></i>人员信息</el-menu-item>
          <el-menu-item index="1" @click="godepartmenttetableDis()"><i class=""></i>部门信息</el-menu-item>
        </el-menu>
      </div> -->
      
    <person-dialog
      :dialogVisible="personDialogVisible"
      v-if="personDialogVisible"
      @addSuccess="addSuccess"
      @addCancel="closePerson"/>
    <!-- <work-dialog :visible="modifydialogFormVisible" :user-info="userInfoForm" :work-property-types="dictDeptTypess" :dept-id="currentNodeOrgId" @success="handleWorkDialogSuccess" @close="handleWorkDialogClose"/> -->
    <create-orgnization-dialog
      :deptVisible="deptDialogVisible"
       @created="createdDept"
       @close="closeDialog"
       v-if="deptDialogVisible"/>
  </div>
</template>

<script>
  import personDialog from '@/components/sysSelectPeople.vue'
  import createOrgnizationDialog from './createOrgnizaitonDialog.vue'
  import {TokenAPI} from '@/request/TokenAPI.js'
  export default {
    data () {
      return {
        activeIndex: 0,
        deptDatas: [],
        activeName: 'first',
        props: {
          id: 'id',
          label: 'deptName',
          children: 'children'
        },
        deptPerson: [],
        listLoading: false,
        deptDialogVisible: false,
        personDialogVisible: false,
        deptInfo: {},
        total: 0,
        page: {
          page: 1,
          pageSize: 10
        },
        token: TokenAPI.getToken()
      }
    },
    // methods end
    mounted () {
      this.getDepts()
    },
    methods: {
      // 分页当前页改变时的函数
      handleCurrentChange (val) {
        this.page.page = val
        this.getDeptPerson(this.deptInfo.OrgID)
      },
      // pageSize发生改变时触发
      handleSizeChange (size) {
        this.page.pageSize = size
        this.getDeptPerson(this.deptInfo.OrgID)
      },
      // 获取全部部门
      getDepts () {
        let params = {
          page: 1,
          pagesize: 1000,
          OrgName: ''
        }
        this.$request.post('/sys/index/getAllOrg', params).then(res => {
          let data = res.data.data
          this.deptInfo = data[0]
          this.activeIndex = 0
          this.$set(this, 'deptDatas', data)
          this.getDeptPerson(this.deptInfo.OrgID)
        })
      },
      // 添加部门
      addDept () {
        this.deptDialogVisible = true
        console.log('....')
      },
      // 获取部门下成员
      getDeptPerson (deptId) {
        let params = {
          OrgID: deptId,
          page: this.page.page,
          pagesize: this.page.pageSize
        }
        this.$request.post('/sys/index/getUsersByOrgID', params).then(res => {
          let data = res.data
          this.deptPerson = data.data
          this.total = data.count
        })
      },
      // 创建完部门回调
      createdDept () {
        this.closeDialog()
        this.getDepts()
      },
      // 关闭对话框
      closeDialog () {
        this.deptDialogVisible = false
      },
      // 点击切换tab页
      tabClick (tab, event) {
        let name = tab.name
        if (name === 'first') {
          this.getDeptPerson(this.deptInfo.OrgID)
        }
        // this.activeName = name
      },
      // 点击左侧类型
      deptClick (dept, index) {
        this.activeIndex = index
        this.deptInfo = dept
        this.page = {
          page: 1,
          pageSize: 10
        }
        this.getDeptPerson(this.deptInfo.OrgID)
      },
      // 删除部门
      deleteDept () {
      },
      // 添加人员
      addPerson () {
        this.personDialogVisible = true
      },
      addSuccess (arr) {
        let userIds = ''
        arr.forEach((value, index) => {
          if (index === arr.length - 1) {
            userIds += `${value.UserID}`
          } else {
            userIds += `${value.UserID},`
          }
        })
        let params = {
          OrgID: this.deptInfo.OrgID,
          UserID: userIds
        }
        this.$request.post('/sys/index/setOrgUsers', params).then(res => {
          let data = res.data
          if (data.ID === '-1') {
            this.$message(`${data.msg}`)
          } else {
            this.personDialogVisible = false
            this.$message('添加成功')
          }
        }, err => {
          console.error(err)
          this.$message('添加失败')
        })
      },
      removeMember (row) {
        let params = {
          OrgID: row.OrgID,
          UserID: row.UserID,
          token: this.token
        }
        this.$request.post('/sys/index/deleteorgtouser', params).then(res => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.getDeptPerson(this.deptInfo.id)
        }, () => {
          this.$message({
            message: '删除失败！',
            type: 'error'
          })
        })
      },
      closePerson () {
        this.personDialogVisible = false
      }
    },
    computed: {
    },
    watch: {
    },
    created () {
    },
    components: {
      createOrgnizationDialog, personDialog
      // workDialog, personDialog, createOrgnizationDialog
    }
  }
</script>

<style lang="scss" scoped>
.sys-org-tree {
  list-style: none;
  .bg_white {
    background: white;
  }
  .padding_20 {
    padding: 10px;
  }
  .margin_10 {
    margin: 10px;
  }
  .org_row {
    min-height: 500px;
    margin-top: 10px;
    ul {
      border: 1px solid #eee;
      border-radius: 5px;
      background: #eef1f6;
      .deptLi {
        font-size: 16px;
        cursor: pointer;
        color: black;
        background: #eef1f6;
        border-bottom: 1px solid #c8d4e4;
        height: 32px;
        padding: 5px 30px;
        line-height: 32px;
      }
      .deptLi:hover {
        background: #e2ebf4;
      }
      .active {
        background: #d1dae5;
      }
      .active:hover {
        background: #d1dae5;
      }
    }
  }
  .temp-cb{
		font-size: 12px;
		position: absolute;
		top: 73px;
		/*left: 100px*/
  }
}
</style>