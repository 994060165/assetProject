<template>
<div class="asset__detail">
  <el-dialog title="资产信息" :visible="visible" size="large" :modal="true" @open="handleOpen" @close="handleClose" :close-on-click-modal="false">
    <el-row>
      <el-col :span="14">
        <p><b>资产名称</b><span>{{asset.name}}</span></p>
        <p><b>资产品牌</b><span>{{asset.maker_name}}</span></p>
        <p><b>资产型号</b><span>{{asset.model_num}}</span></p>
        <p><b>资产序列号</b><span>{{asset.asset_num}}</span></p>
        <p><b>资产标签号</b><span>{{asset.tag_num}}</span></p>
        <p><b>采购金额</b><span>{{asset.value}}</span></p>
        <p><b>资产类别</b><span>{{asset.financial_category}}</span></p>
        <p><b>责任部门</b><span>{{asset.deparment}}</span></p>
        <p><b>领用时间</b><span>{{asset.start_time}}</span></p>
        <p><b>资产位置</b><span>{{asset.location}}</span></p>
      </el-col>
      <el-col :span="10">
        <p><b>资产图片</b><span><img src="../../assets/images/u433.png"/></span></p>
        <p><b>资产状态</b><span>完好</span></p>
        <p><b>所属课题</b><span>{{asset.topic}}</span></p>
        <p><b>领用人</b><span>{{asset.person}}</span></p>
      </el-col>
    </el-row>
    <el-row>
      <el-collapse v-model="collapseActiveName">
        <el-collapse-item title="位置详情" name="1">
          <el-table :data="asset.locationHis">
            <el-table-column prop="datetime" label="时间"></el-table-column>
            <el-table-column prop="location" label="位置"></el-table-column>
            <el-table-column prop="description" label="内容"></el-table-column>
            <el-table-column prop="reason" label="说明"></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import api from '@/api'

export default {
  name: 'asset__detail',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      collapseActiveName: 0,
      asset: {}
    }
  },
  computed: {
  },
  methods: {
    handleClose () {
      this.asset = {}
      this.collapseActiveName = 0
      this.$emit('closeDialog')
    },
    handleOpen () {
      this.asset.locationHis || api.getAssetLocation(this.asset.asset_id).then(response => {
        this.asset.locationHis = response.data.locationHis
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/base.scss';

.asset__detail{
  p{
    margin: 0 0 $global-gap $global-gap * 2;
  }
  b{
    display: inline-block;
    width: $global-gap * 10;
    padding-right: $global-gap * 2;
  }
  img{
    width: 200px;
  }
  .el-collapse{
    margin-left: $global-gap * 2;
  }
}

</style>
