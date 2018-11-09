<template>
<div class="asset-check__detail">
  <el-dialog title="资产信息" v-model="visible" size="large" @open="handleOpen" @close="handleClose" :modal="true" :close-on-click-modal="false">
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane label="未盘点" name="uncheck">
        <h3>未盘点设备{{unchecks.length}}台</h3>
        <tab-table :data="unchecks" v-loading = "loading"></tab-table>
      </el-tab-pane>
      <el-tab-pane label="已盘点" name="check">
        <h3>已盘点设备{{checks.length}}台</h3>
        <tab-table :data="checks" v-loading = "loading"></tab-table>
      </el-tab-pane>
    </el-tabs>
    <el-row>
      <el-col :span="12">
        <label>任务执行人</label>
        <span>{{check.executor}}</span>
      </el-col>
      <el-col :span="12">
        <label>截止时间</label>
        <span>{{check.deadline}}</span>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
     <el-button type="primary" @click="check = {}">关 闭</el-button>
   </span>
  </el-dialog>
</div>
</template>

<script>
import api from '@/api'

export default {
  name: 'asset-check__detail',
  components: {
    'tab-table': {
      props: {
        data: {
          type: Array,
          required: true
        }
      },
      template: ['<el-table :data="data">',
        '  <el-table-column prop="tag_num" label="资产标签号"></el-table-column>',
        '  <el-table-column prop="name" label="名称"></el-table-column>',
        '  <el-table-column prop="model_num" label="型号"></el-table-column>',
        '  <el-table-column prop="deparment" label="部门"></el-table-column>',
        '  <el-table-column prop="person" label="负责人"></el-table-column>',
        '</el-table>'
      ].join('')
    }
  },
  data () {
    return {
      activeTabName: 'uncheck',
      check: {},
      checks: [],
      unchecks: [],
      loading: true
    }
  },
  computed: {
    visible () {
      return this.check.checktask_id !== undefined
    }
  },
  methods: {
    handleClose () {
      this.check = {}
      this.unchecks = []
      this.checks = []
      this.activeTabName = 'uncheck'
    },
    handleOpen () {
      if (this.check.assets) {
        this.filterCheck()
      } else {
        this.loading = true
        Promise.all([api.fetchCheckAssetList({
          checktask_id: this.check.checktask_id,
          check_flag: 0
        }), api.fetchCheckAssetList({
          checktask_id: this.check.checktask_id,
          check_flag: 1
        })]).then(response => {
          this.loading = false
          this.unchecks = response[0].data.checks
          this.checks = response[1].data.checks
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/base.scss';

.asset-check__detail{
  .el-tabs__header{
    margin: 0;
  }
  .el-tab-pane {
    padding: 0 $global-gap * 2;
    h3{
      margin-left: -$global-gap;
    }
  }
  .el-row{
    margin: $global-gap 0 0 $global-gap * 2;
  }
  label{
    margin-right: $global-gap * 2;
  }
}

</style>
