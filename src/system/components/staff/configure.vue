<template>
  <div class="dictTable">
    <section class="">
      <el-col :span="24" class="toolbar" style="background: white;padding-bottom: 0px;">
        <el-row>
          <el-col :span="17">
            <span class="icon" @click="goBack()"></span>
            <span class="title">人员角色信息</span>
          </el-col>
          <el-col :span="7" style="float:left;">
            <el-row>
              
              <!-- <el-col :span='1' v-show="isCollapsed">
                <i class="el-icon-search" @click="" title="搜索"></i>
              </el-col>
              <el-col :span="8" style="float: left;width: 39%" v-show="isCollapsed">
                <el-input icon="close" :on-icon-click="handleIconClick" v-model="searchKey" placeholder="搜索"></el-input>
              </el-col>
              <el-col :span='1' v-show="!isCollapsed" style="position: relative; left: 38%;">
                <i class="el-icon-search" @click="isCollapse" title="搜索"></i>
              </el-col> -->
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
          <el-table-column prop="name" label="角色英文名称"  >
          </el-table-column>
          <el-table-column prop="description" label="描述" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <!--删除-->
              <el-switch
                v-model="scope.row.qyState"
                on-text="启用"
                off-text="停用"
                @change="changeState(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <!-- <el-col :span="24" style="background: #eee;padding: 0px 15px;">
        <el-row>
          <el-col :span="24" class="footbar">
            <div class="el-pagination">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-col> -->
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import { queryPartStaffRolesByUserId, queryRolesByUserId, deleteByIds, deleteStaffRolesByUserIdRoleIds, addUserToRole } from '../../service/personnel'
  import searchUserDialog from './configuserDialog.vue'
  export default {
    name: 'hello',
    data () {
      return {
//        信息列表
        loading2: false,
        searchKey: '',
        isCollapsed: true,
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
        showNameUp: false
      }
    },
    mounted () {
    },
    created () {
      this.getData()
      // this.getDictList()
    },
    watch: {

    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      getData () {
        let param = {
          userId: this.$route.params.id,
          pageSize: 20,
          page: 1,
          queryKey: ''
        }
        queryPartStaffRolesByUserId(param).then(res => {
          let data = res.data
          this.listLoading = true
          this.roleId = this.$route.params.id
          let params = `${this.$route.params.id}?orderKey=${this.sortKey}&page=${this.page}&pageSize=${this.pageSize}`
          queryRolesByUserId(params).then(roleIds => {
            for (let i = 0; i < data.length; i++) {
              data[i].qyState = false
              for (let j = 0; j < roleIds.length; j++) {
                if (data[i].roleId === roleIds[j].roleId) {
                  data[i].qyState = true
                }
              }
            }
            this.tableData = data
            this.listLoading = false
          })
        })
      },
      // 是否显示输入框
      isCollapse () {
        this.isCollapsed = true
      },
      // 输入框点击×号
      handleIconClick () {
        this.searchKey = ''
      },
      // 切换启用状态
      changeState (row) {
        if (row.qyState === true) {
          let param = {
            roleIds: row.roleId,
            userId: this.$route.params.id
          }
          addUserToRole(param).then(data => {
            this.$message('启用成功')
            this.getData()
          })
        } else if (row.qyState === false) {
          this.deleteStaffRolesByUserIdRoleIds(row)
        }
      },
//      删除
      deleteStaffRolesByUserIdRoleIds (row) {
        let parmes = {
          roleIds: row.roleId,
          userId: this.$route.params.id
        }
        deleteStaffRolesByUserIdRoleIds(parmes).then(data => {
          this.$message('停用成功')
          this.getData()
        })
      },
      // 刷新
      refresh () {
        this.getDictList()
      },
      // 添加
      create () {
        // this.userDialogVisible = true
      },
      // 删除
      deleteDicts (index) {
        this.$confirm('是否确认删除？', '提示', {
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
      // 分页当前页改变时的函数
      handleCurrentChange (val) {
        this.page = val
        this.getDictList()
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
            let parmes = {
              userId: this.$route.params.id
            }
            deleteByIds(parmes).then(data => {
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
      addMember (candidates) {
        if (candidates.length > 0) {
          let roleIds = ''
          for (let userRole of candidates) {
            if (roleIds === '') {
              roleIds = userRole.roleId
            } else {
              roleIds = roleIds + ',' + userRole.roleId
            }
          }
          let param = {
            roleIds: roleIds,
            userId: this.roleId
          }
          addUserToRole(param).then(data => {
            this.getDictList()
          })
        } else {
        }
      },
      // 角色英文名称升序
      sortByNameAsc () {
        this.showNameUp = true
        this.showNameDown = false
        let sortType = encodeURIComponent('+')
        this.sortKey = 'name' + sortType
        this.getDictList()
      },
      // 角色英文名称降序
      sortByNameDesc () {
        this.showNameDown = true
        this.showNameUp = false
        let sortType = encodeURIComponent('-')
        this.sortKey = 'name' + sortType
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
