<template>
  <div class="menuPage white-bg">
    <el-row class="padding-10 text-center">中国科学院过程工程研究所</el-row>
    <el-row class="padding-10">
      <el-form ref="form" :model="assetInfo" label-width="240px">
        <el-form-item label="资产名称">
          <div v-text="assetInfo.name"></div>
        </el-form-item>
        <el-form-item label="规格编号">
          <div v-text="assetInfo.category"></div>
        </el-form-item>
        <el-form-item label="标签号">
          <div v-text="assetInfo.tag_num"></div>
        </el-form-item>
        <el-form-item label="入库单号">
          <div v-text="assetInfo.model_num"></div>
        </el-form-item>
        <el-form-item label="设备原值">
          <div v-text="assetInfo.value"></div>
        </el-form-item>
        <el-form-item label="启用日期">
          <div>{{assetInfo.start_time | moment}}</div>
        </el-form-item>
        <el-form-item label="折旧年限">
          <div v-text="assetInfo.start_time"></div>
        </el-form-item>
        <el-form-item label="资产部门">
          <div v-text="assetInfo.deparment"></div>
        </el-form-item>
        <el-form-item label="存放地点">
          <div v-text="assetInfo.location"></div>
        </el-form-item>
        <el-form-item label="经手人">
          <div v-text="assetInfo.person"></div>
        </el-form-item>
        <el-form-item label="责任人">
          <div v-text="assetInfo.person"></div>
        </el-form-item>
        <el-form-item label="使用人">
          <div v-text="assetInfo.person"></div>
        </el-form-item>
        <el-form-item label="资产用途">
          <div v-text="assetInfo.category"></div>
        </el-form-item>
        <el-form-item label="计量信息">
          <div v-text="assetInfo.category"></div>
        </el-form-item>
        <el-form-item label="设备状态">
          <div v-text="assetInfo.status"></div>
        </el-form-item>
        <el-form-item label="资产取得方式">
          <div v-text="assetInfo.minvalue"></div>
        </el-form-item>
        <el-form-item label="采购合同号">
          <div v-text="assetInfo.model_num"></div>
        </el-form-item>
        <el-form-item label="验收单号">
          <div v-text="assetInfo.model_num"></div>
        </el-form-item>
        <el-form-item label="采购来源">
          <div v-text="assetInfo.parent_name"></div>
        </el-form-item>
        <el-form-item label="生产国家">
          <div v-text="assetInfo.parent_name"></div>
        </el-form-item>
        <el-form-item label="生产商及保修信息">
          <div v-text="assetInfo.maker_name"></div>
        </el-form-item>
        <el-form-item label="经销商及联系方式">
          <div v-text="assetInfo.parent_name"></div>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      assetInfo: {}
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取菜单数据
    getData () {
      let params = {
        id: this.$route.params.assetId
      }
      this.$request.post(`/res/index/getassetforassetid`, params).then(res => {
        let data = res.data
        for (let item in data) {
          let assetInfo = data[item]
          this.assetInfo = assetInfo
        }
      })
    }
  }
}
</script>

