<template>
  <el-row >
    <el-row class="">
      <el-col :span="24" class="toolbar" style="background: white;padding-bottom: 0px;">
        <el-row class="padding-10" >
          <el-col :span="17">
            <el-button type="primary" @click="goBack()">返回</el-button>
            <span class="title padding-10" sytle="display: inline-block;">人员角色信息</span>
          </el-col>
          <el-col :span="7" style="float:left;">
            <el-row>
              <el-col :span='12' style="float:left;">
                <span style="display: inline-block; float: right; margin-right: 30px">
                  <ul class="rightUl">
                    <!-- <li class="sort">
                      <div class="sortable" style="display: inline-block" @click="sortVisiableFun">
                        排序<span class="el-icon-caret-bottom" ></span>
                      </div>
                      <ul class="sortOptions" v-show="sortVisiable">
                        <li>
                          <span>角色英文名称</span>
                          <em >
                            <span class="up" @click="sortByNameAsc" :class="{upbackground: showNameUp == true}"></span>
                            <span class="down" @click="sortByNameDesc" :class="{downbackground: showNameDown == true}"></span>
                          </em>
                        </li>
                      </ul>
                    </li> -->
                    <!-- <li>
                      <span @click="refresh">刷新</span>
                    </li> -->
                    <!-- <li>
                      <span @click="create">添加角色</span>
                    </li> -->
                    <!-- <li>
                      <span @click="batchRemove(sels)">删除</span>
                    </li> -->
                  </ul>
                </span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24" class="toolbar2" style="background: #eee;padding: 15px;" v-loading="loading2" element-loading-text="拼命加载中">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" v-loading="listLoading" style="width: 100%;" :stripe="true">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column type="index" width="100" label="序号">
          </el-table-column>
          <el-table-column prop="RoleID" label="角色英文名称"  >
          </el-table-column>
          <el-table-column prop="RoleName" label="角色汉语名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <!--删除-->
              <el-switch
                v-model="scope.row.qyState"
                on-text="启用"
                off-text="停用"
                @change="changeState(scope.row, scope.index)">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-row>
</template>

<script type="text/ecmascript-6">
  import searchUserDialog from './configuserDialog.vue'
  import {TokenAPI} from '@/request/TokenAPI'
  export default {
    name: 'hello',
    data () {
      return {
//        信息列表
        loading2: false,
        searchKey: '',
        sortVisiable: false,
        total: 0,
        pageSize: 10,
        page: 1,
        currentPage: 1,
        roleId: null,
        checked: false,
        showOverflow: false,
        listLoading: false,
        tableData: [],
        sels: [],
        selectionModule: [],
        roleType: {},
        sortKey: '',
        showNameDown: false,
        showNameUp: false,
        token: TokenAPI.getToken()
      }
    },
    mounted () {
    },
    created () {
      this.getData()
    },
    watch: {

    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      getData () {
        this.listLoading = true
        let params = {
          UserID: this.$route.params.UserID,
          pagesize: 20,
          page: 1
        }
        // 先获取有什么角色
        this.$request.post(`/sys/index/getRolesByUserID`, params).then(res => {
          let userRoleData = res.data.data
          // 再获取所有角色内容
          let params1 = {
            page: 1,
            pagesize: 100,
            RoleID: ''
          }
          this.$request.post(`/sys/index/getRolesTree`, params1).then(res => {
            let allRoleData = res.data.data
            allRoleData.forEach(value => {
              value.qyState = false
              userRoleData.forEach(value2 => {
                if (value2.RoleID === value.RoleID) {
                  value.qyState = true
                }
              })
            })
            this.tableData = allRoleData
            this.listLoading = false
          }, err => {
            console.log(err)
            this.$message({
              type: 'warning',
              message: '查询失败'
            })
            this.listLoading = false
          })
        }, error => {
          console.log(error)
          this.$message({
            type: 'warning',
            message: '查询失败'
          })
          this.listLoading = false
        })
      },
      // 切换启用状态
      changeState (row) {
        if (row.qyState === true) {
          this.addRoleToUser(row)
        } else {
          this.deleteRoletoUser(row)
        }
      },
      deleteRoletoUser (row) {
        let params = {
          UserID: this.$route.params.UserID,
          RoleID: row.RoleID,
          token: this.token
        }
        this.$request.post('/sys/index/deleteRoleToUser', params).then(res => {
          let data = res.data
          if (data.ID === '-1') {
            this.$message({
              type: 'warning',
              message: `${data.msg}`
            })
          } else {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          }
          this.getData()
        }, err => {
          console.log(err)
          this.$message({
            type: 'warning',
            message: '操作失败'
          })
          this.getData()
        })
      },
      addRoleToUser (row) {
        // 循环批量加角色，为了对应后台先删除再添加的逻辑
        let data = this.tableData
        let RoleIDs = ''
        if (data.length > 0) {
          data.forEach((value, index) => {
            if (index === data.length - 1 && value.qyState === true) {
              RoleIDs += `${value.RoleID}`
            } else if (value.qyState === true) {
              RoleIDs += `${value.RoleID},`
            }
          })
          let params = {
            UserID: this.$route.params.UserID,
            RoleID: RoleIDs
          }
          this.$request.post('/sys/index/setUserRoles', params).then(res => {
            let data = res.data
            if (data.ID === '0') {
              this.$message({
                type: 'warning',
                message: `${data.msg}`
              })
            } else {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            }
            this.getData()
          }, err => {
            console.log(err)
            this.$message({
              type: 'warning',
              message: '操作失败'
            })
            this.getData()
          })
        }
      },
      // 刷新
      refresh () {
        this.getDictList()
      },
      // 分页当前页改变时的函数
      handleCurrentChange (val) {
        this.page = val
        this.getDictList()
      }
    },
    components: {
      searchUserDialog
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  input {
    border: none !important;
  }
  .dictTable {
    text-align: left;
    .toolbar {
      height: 55px;
      line-height: 55px;
      background: #fff;
      .icon {
        background: url(../../assets/img/personnel/goback.png) center center no-repeat;
        display: inline-block;
        width: 40px;
        height: 55px;
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
        height: 55px;
        line-height: 55px;
        margin-top: 0;
        float: left;
      }
      .moduleSelect {
        width: 100%;
        padding: 5px 10px;
        border: none;
        background-color: #f7f7f7;
        margin-left: 5px;
      }
      .rightUl {
        li {
          float: left;
          padding-left: 10px;
          cursor: pointer;
        }
        .sort {
          padding-right: 10px;
          position: relative;
          width: 50px;
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
            top: 58px;
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
                .upbackground {
                  background: url(../../assets/img/personnel/i-up-2.png) center center no-repeat;
                }
                .down {
                  background: url(../../assets/img/personnel/i-down.png) center center no-repeat;
                }
                .down:hover {
                  background: url(../../assets/img/personnel/i-down-2.png) center center no-repeat;
                }
                .downbackground {
                  background: url(../../assets/img/personnel/i-down-2.png) center center no-repeat;
                }
              }
            }
            li:hover {
              background-color: #eee;
            }
          }
        }
      }
    }
    .toolbar2{
      .opr{
        display: inline-block;
        width: 20px;
        height: 25px;
        float: left;
        cursor: pointer;
        border: 0;
        margin-left: 0;
      }
      .edit_opr{
        background: url(../../assets/img/personnel/personnel_icon.png) center center no-repeat;
        background-position: -7px -54px;
      }
      .edit_opr:hover{
        background: url(../../assets/img/personnel/personnel_icon.png) center center no-repeat;
        background-position: -35px -54px;
      }
      .delete_opr{
        background: url(../../assets/img/personnel/personnel_icon.png) center center no-repeat;
        background-position: -7px -30px;
      }
      .delete_opr:hover{
        background: url(../../assets/img/personnel/personnel_icon.png) center center no-repeat;
        background-position: -35px -30px;
      }
      .document_opr{
        background: url(../../assets/img/personnel/personnel_icon.png) center center no-repeat;
        background-position: -7px -79px;
      }
      .document_opr:hover{
        background: url(../../assets/img/personnel/personnel_icon.png) center center no-repeat;
        background-position: -35px -79px;
      }
      .information_opr{
        background: url(../../assets/img/personnel/information.png) center center no-repeat;
      }
      .configure_opr{
        background: url(../../assets/img/personnel/configureImg.png) center center no-repeat;
      }
      .informationOptions {
        width: 130px;
        min-width: 130px;
        border: 1px solid #dedede;
        background: #fff;
        margin: 0;
        padding: 5px 0;
        position: absolute;
        top: 30px;
        left: -25px;
        z-index: 5;
        box-shadow: 3px 3px 3px rgba(0,0,0,.1);
        li{
          height: 30px;
          line-height: 30px;
          margin-bottom: 3px;
          text-align: left;
          font-size: 14px;
        }
      }
    }
    .footbar {
      height: 55px;
      padding: 15px;
      background: #fff;
      .el-pagination {
        float: right;
      }
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
  }
</style>
