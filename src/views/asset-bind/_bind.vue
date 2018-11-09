<template>
<div class="asset-bind__bind">
  <el-dialog title="资产绑定" v-model="visible" size="large" :modal="true" @open="handleOpen" @close="handleClose" :close-on-click-modal="false">
    <el-table :data="asset" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="设备名称" ></el-table-column>
      <el-table-column prop="tag_num" label="设备标签码"></el-table-column>
      <el-table-column inline-template :context="_self" label="操作">
        <div>
          <el-button type="text" size="small" :loading="row.loading" @click="handleBind(row)">绑定</el-button>
        </div>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="asset = []">关 闭</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import api from '@/api'

export default {
  name: 'asset-bind__bind',
  data () {
    return {
      asset: [],
      currentRow: null,
      visible2: false
    }
  },
  computed: {
    visible () {
      return this.asset.length > 0
    }
  },
  methods: {
    tableRowClassName (row, index) {
      if (row.isBind) {
        return 'bind-row'
      }
    },
    handleBind (row) {
      this.$set(row, 'loading', true)
      api.bindAsset({
        asset_num: row.asset_num
      }).then(response => {
        row.isBind = true
        row.loading = false
        this.$message({
          message: '绑定成功',
          type: 'success'
        })
      })
    },
    handleClose () {
      this.asset = []
    },
    handleOpen () {
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/base.scss';

.asset-bind__bind{
  .bind-row {
    background: #c9e5f5;
  }
}

</style>
