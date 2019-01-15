<template>
<div class="asset__detail">
  <el-dialog title="资产信息" :visible="visible" size="large" :modal="true" @open="handleOpen" @close="handleClose" :close-on-click-modal="false">
    <el-row>
      <el-col :span="14">
        <p><b>资产名称</b><span>{{asset.name}}</span></p>
        <p><b>资产品牌</b><span>{{asset.maker_name}}</span></p>
        <p><b>资产型号</b><span>{{asset.model_num}}</span></p>
        <p><b>资产编码</b><span>{{asset.asset_num}}</span></p>
        <p><b>资产标签号</b><span>{{asset.tag_num}}</span></p>
        <p><b>采购金额</b><span>{{asset.value}}</span></p>
        <p><b>资产类别</b><span>{{asset.financial_category}}</span></p>
        <p><b>责任部门</b><span>{{asset.deparment}}</span></p>
        <p><b>领用人</b><span>{{asset.person}}</span></p>
        <p><b>领用时间</b><span>{{asset.start_time}}</span></p>
        <p><b>资产位置</b><span>{{asset.location}}</span></p>
      </el-col>
      <el-col :span="10">
        <p><b>资产状态</b><span>完好</span></p>
        <p><b>所属课题</b><span>{{asset.topic}}</span></p>
        <p><b>责任人</b><span>{{asset.zrr_name}}</span></p>
      </el-col>
    </el-row>
    <el-row>
      <el-collapse v-model="collapseActiveName" v-if="type==='assetwls'">
        <el-collapse-item title="资产图片" name="1">
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="text-center">标签与铭牌合照</div>
              <img :src="imgs.img_bq" alt="" class="w-full" @click="showImgPlus('img_bq')">
            </el-col>
            <el-col :span="6">
              <div class="text-center">标签与局部合照</div>
              <img :src="imgs.img_jb" alt="" class="w-full" @click="showImgPlus('img_jb')">
            </el-col>
            <el-col :span="6">
              <div class="text-center">资产正面整体照片</div>
              <img :src="imgs.img_zt" alt="" class="w-full" @click="showImgPlus('img_zt')">
            </el-col>
            <el-col :span="6">
              <div class="text-center"> 其他照片</div>
              <img :src="imgs.img_qt" alt="" class="w-full" @click="showImgPlus('img_qt')">
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
  <el-dialog  title="图片详情" :visible="imgVisible" size="large" :before-close="closeImgDialog" :modal="true" >
    
    <div class="imgDiv">
      <!-- <div style="text-align: right;">
        <el-button type="primary" icon="el-icon-refresh" size="mini" circle @click="transform"></el-button>
      </div> -->
      <img :src="imgPlus" alt="">
    </div>
  </el-dialog>
</div>
</template>

<script>
import { type } from '../../../static/data'
export default {
  name: 'asset__detail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imgs: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      collapseActiveName: '1',
      asset: {},
      type: type,
      imgPlus: null,
      imgVisible: false
    }
  },
  computed: {
  },
  methods: {
    handleClose () {
      this.asset = {}
      this.collapseActiveName = '1'
      this.$emit('closeDialog')
    },
    handleOpen () {
      // this.asset.locationHis || api.getAssetLocation(this.asset.asset_id).then(response => {
      //   this.asset.locationHis = response.data.locationHis
      // })
    },
    showImgPlus (img) {
      console.log('....')
      this.imgPlus = this.imgs[img]
      this.imgVisible = true
    },
    closeImgDialog () {
      this.imgVisible = false
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
    cursor: zoom-in;
  }
  .el-collapse{
    margin-left: $global-gap * 2;
  }
}

</style>
<style lang="scss" scoped>
  .imgDiv {
    width: 60%;
    margin: 0 auto;
    img {
      width: 100%;
      cursor: default;
    }
  }
</style>
