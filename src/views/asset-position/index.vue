<template>
<div class="asset-position">
  <el-row :gutter="16">
    <el-col :span="10">
      <h3>资产位置概览</h3>
      <el-table :data="locationCount" :row-class-name="tableRowClassName">
        <el-table-column prop="location" label="位置" width="180"></el-table-column>
        <el-table-column prop="num" label="台数"></el-table-column>
       </el-table>
    </el-col>
    <el-col :span="14">
      <h3>位置变动提醒</h3>
      <datagrid ref="datagrid" :table-data="allMessages" :paging="false">
        <template slot="table">
          <el-table-column prop="name" label="资产名称"></el-table-column>
          <el-table-column prop="description" label="位置描述"></el-table-column>
          <el-table-column inline-template :context="_self" width="100" label="操作">
            <div>
              <el-button @click="handleDetail(row)" type="text" size="small">查看</el-button>
              <el-button @click="handleDelete($index, row)" type="text" size="small">删除</el-button>
            </div>
          </el-table-column>
        </template>
      </datagrid>
    </el-col>

  </el-row>
  <detail ref="detail"></detail>
</div>
</template>

<script>
import datagrid from '@/components/common/datagrid.vue'
import detail from '@/components/asset/detail.vue'
import api from '@/api'

export default {
  components: {
    datagrid,
    detail
  },
  data () {
    return {
      allMessages: [],
      locationCount: []
    }
  },
  created () {
    api.getMessageList().then(response => {
      this.allMessages = response.data.messages
      this.$refs.datagrid.table.loading = false
    })
    api.getLocationCount().then(response => {
      this.locationCount.push({ location: '在用', num: response.data.location[0].in_use_num, isGroup: true })
      this.locationCount = this.locationCount.concat(response.data.location[0].in_use)
      this.locationCount.push({ location: '未用', num: response.data.location[1].not_in_use_num, isGroup: true })
      this.locationCount = this.locationCount.concat(response.data.location[1].not_in_use)
    })
  },
  methods: {
    tableRowClassName (row, index) {
      return row.isGroup ? 'grow-count' : ''
    },
    handleDelete (index, row) {
      api.deleteMessage({
        asset_id: row.asset_id
      }).then(response => {
        this.allMessages.splice(index, 1)
        this.$message({
          message: '删除信息成功',
          type: 'success'
        })
      })
    },
    handleDetail (row) {
      if (row.asset === undefined) {
        api.getAsset(row.asset_id).then(response => {
          row.asset = Object.assign({}, response.data.assets[0])
          this.$refs.detail.asset = response.data.assets[0]
        })
      } else {
        this.$refs.detail.asset = row.asset
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/base.scss';

.asset-position{
  .grow-count {
    font-weight: bold;
  }
  tr:not(.grow-count) td:first-of-type{
    padding-left: $global-gap * 2;
  }
  .el-table .positive-row {
    background: #e2f0e4;
  }
  .datagrid__action {
    text-align: right;
    position: relative;
  }
  .el-checkbox{
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
