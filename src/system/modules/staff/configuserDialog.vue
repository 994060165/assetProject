<template>
  <el-dialog
    title="选择角色"
    :visible="dialogVisible"
    @open="retrieveData"
    :showClose="false">
    <el-input
      placeholder="请输入检索关键字"
      icon="search"
      v-model="queryKey"
      width="100%"
      @click="retrieveData">
    </el-input>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="member-table"
      @selection-change="handleSelectionChange">
      <el-table-column
        prop="checked"
        type="selection">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色英文名称"
        width="200px">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="类型"
        width="120px" :formatter="roleTypeFormatter">
      </el-table-column>
      <el-table-column label="是否启用" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row.state === 'TRUE'">是</div>
          <div v-else>否</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagnationBar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
  import { queryPartStaffRolesByUserId } from '../../service/personnel'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        'default' () {
          return {}
        }
      },
      roleId: {
        type: String,
        'default' () {
          return {}
        }
      }
    },
    data () {
      return {
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        queryKey: '',
        total: 0,
        localVisible: this.dialogVisible,
        selectCandidates: [],
        orgNameMap: {},
        roleType: {}
      }
    },
    mounted () {
    },
    computed: {
    },
    watch: {
      dialogVisible () {
        this.localVisible = this.dialogVisible
      }
    },
    created () {
    },
    methods: {
      extractCorpOrgIds (users) {
        let orgIds = {}
        let list = []
        for (let user of users) {
          if (orgIds[user.corpOrgId] !== true) {
            orgIds[user.corpOrgId] = true
            list.push(user.corpOrgId)
          }
        }
        return list
      },
      makeOrgNameMap (orgs) {
        let nameMap = {}
        for (let org of orgs) {
          nameMap[org.orgId] = org.deptName
        }
        return nameMap
      },
      retrieveData () {
        let param = {
          userId: this.$route.params.id,
          pageSize: this.pageSize,
          page: this.currentPage,
          queryKey: this.queryKey
        }
        queryPartStaffRolesByUserId(param).then(res => {
          this.total = parseInt(res.headers.count)
          this.tableData = res.data
          let dictparams = []
          for (let type of res) {
            dictparams.push({
              dictCode: 'SYSTEM_ROLE_ATR',
              optionValue: type.roleType
            },
              {
                dictCode: 'SYSTEM_BOOLEAN_STATE',
                optionValue: 'TRUE'
              })
          }
          // getNamesByValues(dictparams).then(data => {
          //   let results = {}
          //   for (let item of data) {
          //     results[item.optionValue] = item.optionName
          //   }
          //   this.roleType = results
          // })
        })
      },
      // 获取类型
      roleTypeFormatter (row, column) {
        return this.roleType[row.roleType]
      },
      orgNameFormatter (row, column) {
        return this.orgNameMap[row.corpOrgId]
      },
      handleConfirm () {
        if (this.selectCandidates.length > 0) {
          this.$emit('addSuccess', this.selectCandidates)
        } else {
          this.$emit('addCancel')
        }
      },
      handleCancel () {
        this.$emit('addCancel')
      },
      handleSelectionChange (val) {
        this.selectCandidates = val
      },
      handleSizeChange (pageSize) {
        this.pageSize = pageSize
        this.retrieveData()
        this.selectCandidates = []
      },
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
<style lang="css" scoped="scope">
  .member-table {
    text-align: left;
  }
</style>
