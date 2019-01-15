<template>
  <div>
    <el-row class="whiteBg padding-10">
      <el-col :span="8">
        系统查询条件配置
      </el-col>
      <el-col :span="8" style="text-align: right; float: right;">
        <!-- <advancedSearch
          :searchPlaceholder="searchPlaceholder"
          :searchStyle="searchStyle"
          :advance="true"
          @search="queryClick">
          <div slot="search">
          </div>
        </advancedSearch> -->
      </el-col>
    </el-row>
    <el-row class="whiteBg padding-10 m-t-10">
      <el-table
        :data="tableData"
        border
        @selection-change="selectionChange"
        style="width: 100%;">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" width="80" label="序号">
        </el-table-column>

        <el-table-column prop="code" width="160" label="条件代码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="codeValue" label="条件值" width="160" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="type"
          label="对应页面">
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作人员"
          width="150">
        </el-table-column>
        <el-table-column
          prop="date"
          label="操作日期"
          width="150">
        </el-table-column>
        <el-table-column
          label="是否启用"
          align="center"
          width="80"> 
          <template slot-scope="scope">
            <!--删除-->
            <el-switch
              v-model="scope.row.qyState"
              on-text="启用"
              off-text="停用"
              @change="changeState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
          label="修改对应页面">
          <template slot-scope="scope">
            <el-button type="primary" @click="changeData(scope.row, scope.$index)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchPlaceholder: '输入查询条件',
      searchStyle: 'width: 80%;',
      tableData: [
        {
          code: 'corpusName',
          codeValue: '作文标题',
          type: '一般字符串查询、特殊条件查询',
          qyState: true,
          name: 'sum_he',
          date: '2018-10-24'
        },
        {
          code: 'lowerLimit',
          codeValue: '字数要求',
          type: '一般字符串查询',
          qyState: true,
          name: 'sum_he',
          date: '2018-10-24'
        },
        {
          code: 'rate',
          codeValue: '得分',
          type: '一般字符串查询、特殊条件查询',
          qyState: true,
          name: 'sum_he',
          date: '2018-10-24'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    changeData (rowData, index) {
      console.log('...')
    },
    queryClick () {
    },
    selectionChange (vals) {
      console.log(vals)
    },
    changeState (row) {
      if (row.qyState === true) {
        // let param = {
        //   roleIds: row.roleId,
        //   userId: this.$route.params.id
        // }
        // addUserToRole(param).then(data => {
        //   this.$message('启用成功')
        //   this.getData()
        // })
      } else if (row.qyState === false) {
        // this.deleteStaffRolesByUserIdRoleIds(row)
      }
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
</style>