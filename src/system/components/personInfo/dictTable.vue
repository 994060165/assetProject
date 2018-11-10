<template>
  <div class="dictTable">
    <section class="dictTableSection" @click = "sortVisiable = false">
      <el-col :span="24" class="toolbar" style="background: white;padding-bottom: 0px;">
        <el-row>
          <el-col :span="7">
            <span class="icon" @click="goBack"></span>
            <span class="title">原始语料上传</span>
          </el-col>
        </el-row>
        <el-row class="personForm">
          
        </el-row>
		  </el-col>
      <dataDictEdit
        :form = "dictData"
        :formVisible = "formVisible"
        :formDisabled = "formDisabled"
        :formWatchDisabled = "formWatchDisabled"
        :tableTitle = "tableTitle"
        :tableType = "tableType"
        :editModule = "editModule"
        @getDictList = "getDictList"
        @addCancel = "addCancel">
      </dataDictEdit>
    </section>
  </div>
</template>

<script>
import dataDictEdit from './dataDictEdit.vue'
import { queryOrgInfoByOrgIds } from '../../../../../../service/Organization'
import { ProjectsAPI, LocalEntriesAPI, GlobalEntriesAPI } from '../../../../../../service/Dictionary'
export default {
  name: 'hello',
  data () {
    return {
      queryKey: '',
      codeOrderKey: '',
      valueOrderKey: '',
      codeOrderOption: '',
      valueOrderOption: '',
      isCollapsed: false,
      sortVisiable: false,
      total: 0,
      pageSize: 10,
      page: 1,
      currentPage: 1,
      checked: false,
      showOverflow: true,
      formVisible: false,
      // 系统管理员
      superAdmin: null,
      //  所级管理员
      institutesAdmin: null,
      listLoading: false,
      tableData: [],
      options: [],
      sels: [],
      selectionModule: '',
      tableTitle: '编辑字典详情',
      tableType: '',
      dictData: {},
      formDisabled: false,
      formWatchDisabled: false,
      editModule: null,
      promptInfo: {},
      dictionary: null,
      projectRespository: new ProjectsAPI(),
      form: {
        resource: 'M'
      }
    }
  },
  mounted () {
    this.getSelection()
    this.judgePower()
  },
  created () {
  },
  watch: {

  },
  methods: {
    // 判断人员权限
    judgePower () {
      this.dictionary = new LocalEntriesAPI()
      let data = this.$store.state.auth.rolesTo
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === 'admin') {
          this.institutesAdmin = true
          this.dictionary = new LocalEntriesAPI()
        }
        if (data[i].name === 'superAdmin') {
          this.superAdmin = true
          this.dictionary = new GlobalEntriesAPI()
          return
        }
      }
    },
    // 返回函数
    goBack () {
      this.$router.replace('/home/')
    },
    // 获取模块下拉列表
    getSelection () {
      this.projectRespository.list().then(data => {
        data = data.concat([{code: '', name: ''}])
        this.options = data
        this.getDictList()
      })
    },
    // 获取字典数据
    getDictList () {
      this.formVisible = false
      this.dictionary
        .list(this.queryKey, this.selectionModule, this.page, this.pageSize, `${this.codeOrderKey}${this.valueOrderKey}`)
        .then(res => {
          this.getData(res)
        })
    },
    // 获取数据
    getData (res) {
      this.total = parseInt(res.headers.total)
      if (res.data) {
        let arr = []
        let dictList = res.data
        res.data.forEach(value => {
          if (value.sourceId) {
            arr.push(value.sourceId)
          }
          if (value.orderNo) {
            value.orderNo = parseInt(value.orderNo)
          }
        })
        this.$nextTick(() => {
          if (arr.length > 0) {
            this.dictionary.listByIds(arr).then(res => {
              let data = res.data
              for (let i = 0; i < dictList.length; i++) {
                for (let j = 0; j < data.length; j++) {
                  if (dictList[i].sourceId === data[j].id) {
                    dictList[i].sourceTitle = data[j].optionName
                  }
                }
              }
            })
            this.tableData = dictList
          } else {
            this.tableData = dictList
          }
        })
      }
    },
    // 翻译模块名称
    formatter (row, column) {
      this.options.forEach(value => {
        if (row.project === value.code) {
          row.name = value.name
        }
      })
      return row.name
    },
    // 是否显示输入框
    isCollapse () {
      this.isCollapsed = true
    },
    // 输入框点击×号
    handleIconClick () {
      this.isCollapsed = false
      this.queryKey = ''
    },
    // 刷新
    refresh () {
      this.codeOrderKey = ''
      this.valueOrderKey = ''
      this.page = 1
      this.queryKey = ''
      this.selectionModule = ''
      this.codeOrderOption = ''
      this.valueOrderOption = ''
      this.getDictList()
    },
    // 创建
    create () {
      this.tableType = 'sysAdd'
      this.dictData = {}
      this.formVisible = true
      this.formDisabled = false
      this.formWatchDisabled = false
    },
    // 所级管理员增加副本
    createDict (index, row) {
      if (row.sourceId) {
        this.tableType = 'classEdit'
      } else {
        this.tableType = 'classAdd'
      }
      this.formVisible = true
      this.formDisabled = true
      this.formWatchDisabled = false
      this.editModule = row.project
      this.dictData = row
    },
    // 系统管理员修改字典
    editDict (index, row) {
      this.tableType = 'sysEdit'
      this.formVisible = true
      this.formDisabled = false
      this.formWatchDisabled = false
      this.editModule = row.project
      this.dictData = row
    },
    // 查看字典信息
    watchDict (index, row) {
      this.tableType = ''
      this.formVisible = true
      this.formWatchDisabled = true
      this.editModule = row.project
      this.dictData = row
    },
    // 系统管理员删除字典
    sysDeleteDict (index, row) {
      let idArry = []
      let id = row.id
      idArry.push(row.id)
      this.$confirm('删除字典可能会引起系统功能错误，您确定要删除此字典数据吗？', '删除提示', {
        confirmButtonText: '取消',
        cancelButtonText: '删除',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false,
        type: 'error'
      }).then(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }).catch(() => {
        this.queryInstitutes(idArry)
        setTimeout(() => {
          let message
          if (this.promptInfo.number === 0) {
            message = `您要删除的字典没有副本，您确定要删除吗？`
          } else if (this.promptInfo.number > 0 && this.promptInfo.number < 4) {
            message = `您要删除的字典已有${this.promptInfo.number}个副本，院所为${this.promptInfo.name}，您确定要删除吗？`
          } else {
            message = `您要删除的字典已有${this.promptInfo.number}个副本，您确定要删除吗？`
          }
          this.$confirm(`${message}`, '删除提示', {
            confirmButtonText: '取消',
            cancelButtonText: '删除',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            showClose: false,
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }).catch(() => {
            this.dictionary.delete(id).then(res => {
              this.$alert('删除成功！')
              this.getDictList()
            })
          })
        }, 900)
      })
    },
    // 根据sourceId查询 返回院所名称
    queryInstitutes (idArry) {
      let corpNames = []
      let corpNumber
      this.dictionary.listByIds(idArry).then(res => {
        let data = res.data
        let corpIds = []
        if (data) {
          corpNumber = data.length
          data.forEach(value => {
            corpIds.push(value.corpOrgId)
          })
          if (data.length > 0 && data.length < 4) {
            queryOrgInfoByOrgIds(corpIds).then(data => {
              data.forEach((value, index) => {
                if (index > 1) {
                  corpNames.push(value.deptName + '、')
                } else {
                  corpNames.push(value.deptName)
                }
              })
            })
          } else if (data.length > 3) {
            queryOrgInfoByOrgIds(corpIds).then(data => {
              data.forEach((value, index) => {
                if (index > 1) {
                  corpNames.push(value.deptName + '、')
                } else {
                  corpNames.push(value.deptName)
                }
              })
            })
          }
        }
      })
      setTimeout(() => {
        this.promptInfo = {name: corpNames, number: corpNumber}
      }, 800)
    },
    // 院所删除字典
    classDeleteDict (index, row) {
      this.$confirm('您确定要删除此字典数据吗？', '删除提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.dictionary.delete(row.id).then(res => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else if (res.status !== 200 || res.status !== 204) {
            this.$message({
              type: 'warning',
              message: '删除失败!'
            })
          }
          this.getDictList()
        })
      })
    },
    // 排序
    orderFun (type, option, value) {
      value = option + value
      if (type === 'code') {
        this.codeOrderKey = value
        this.codeOrderOption = type + option
      } else if (type === 'value') {
        this.valueOrderOption = type + option
        if (this.codeOrderKey !== '') {
          this.valueOrderKey = `,${value}`
        } else {
          this.valueOrderKey = value
        }
      }
      this.getDictList()
    },
    // 模块选择
    handleModuleChange (value) {
    },
    // 查询字典搜索方法
    searchDict () {
      this.getDictList()
    },
    // 控制排序是否显示
    sortVisiableFun () {
      this.sortVisiable = !this.sortVisiable
    },
    // 修改选择行
    selsChange (sels) {
      if (sels.length === this.tableData.length) {
        this.checked = true
      } else {
        this.checked = false
      }
      this.sels = sels
    },
    // 分页当前页改变时的函数
    handleCurrentChange (val) {
      this.page = val
      this.getDictList()
    },
    // 切换选择列
    toogleSelection () {
      if (this.sels.length === this.tableData.length) {
        this.$refs.multipleTable.clearSelection()
        this.checked = false
      } else if (this.sels.length < this.tableData.length) {
        this.checked = true
        this.tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      }
    },
    // 批量删除
    sysDeleteArry () {
      if (this.sels.length === 0) {
        this.$message({
          type: 'warning',
          message: '请您选择要删除的字典数据',
          duration: 2000
        })
        return
      }
      let idArry = []
      this.sels.forEach(value => {
        idArry.push(value.id)
      })
      this.$confirm('删除字典可能会引起系统功能错误，您确定要删除此字典数据吗？', '删除提示', {
        confirmButtonText: '取消',
        cancelButtonText: '删除',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false,
        type: 'error'
      }).then(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }).catch(() => {
        this.queryInstitutes(idArry)
        setTimeout(() => {
          let message
          if (this.promptInfo.number === 0) {
            message = `您要删除的字典没有副本，您确定要删除吗？`
          } else if (this.promptInfo.number > 0 && this.promptInfo.number < 4) {
            message = `您要删除的字典已有${this.promptInfo.number}个副本，院所为${this.promptInfo.name}，您确定要删除吗？`
          } else {
            message = `您要删除的字典已有${this.promptInfo.number}个副本，您确定要删除吗？`
          }
          this.$confirm(`${message}`, '删除提示', {
            confirmButtonText: '取消',
            cancelButtonText: '删除',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            showClose: false,
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }).catch(() => {
            let arr = idArry
            this.dictionary.deleteBatch(arr).then(res => {
              this.$alert('删除成功！')
              this.getDictList()
            })
          })
        }, 900)
      })
    },
    addCancel () {
      this.formVisible = false
    }
  },
  components: {
    dataDictEdit
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
  // margin-left: 270px;
  display: flex;
  .dictTableSection {
    width: 100%;
  }
  .personForm {
    background: white;
    padding: 40px;
    margin-top: 10px;
    .personFormRight {
      margin-left: 30px;
    }
  }
  .edit {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(../../assets/img/dataDictionary/spirit.png)  no-repeat;
    background-position: -10px -2px;
    cursor: pointer;
  }
  .edit:hover {
    background-position: -37px -2px;
  }
  .create {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(../../assets/img/dataDictionary/spirit.png)  no-repeat;
    background-position: -10px -53px;
    cursor: pointer;
  }
  .create:hover {
    background-position: -38px -53px;
  }
  .watch {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(../../assets/img/dataDictionary/spirit.png)  no-repeat;
    background-position: -10px -78px;
    cursor: pointer;
  }
  .watch:hover {
    background-position: -38px -78px;
  }
  .delete {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(../../assets/img/dataDictionary/spirit.png)  no-repeat;
    background-position: -10px -29px;
    cursor: pointer;
  }
  .delete:hover {
    background-position: -38px -29px;
  }
  .toolbar {
    height: 46px;
    line-height: 46px;
    background: #fff;
    .icon {
      background: url(../../assets/img/dataDictionary/goback.png) center center no-repeat;
      display: inline-block;
      width: 40px;
      height: 46px;
      line-height: 46px;
      float: left;
      cursor: pointer;
    }
    .icon:hover {
      background: url(../../assets/img/dataDictionary/goback-hover.png) center center no-repeat;
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
                background: url(../../assets/img/dataDictionary/i-up.png) center center no-repeat;
              }
              .upSelect, .up:hover {
                background: url(../../assets/img/dataDictionary/i-up-2.png) center center no-repeat;
              }
              .down {
                background: url(../../assets/img/dataDictionary/i-down.png) center center no-repeat;
              }
              .downSelect, .down:hover {
                background: url(../../assets/img/dataDictionary/i-down-2.png) center center no-repeat;
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
  .footbar {
    height: 55px;
    padding: 15px;
    background: #fff;
    .el-pagination {
      float: right;
    }
  }
}
</style>
