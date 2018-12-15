<template>
<div class="asset-tpl-add">
  <el-dialog title="查看模板" class="model" :visible="visable" :before-close="handleClose" :modal="true" :close-on-press-escape="false" :close-on-click-modal="false" >
    <el-form :model="formData" ref="submitForm" label-width="120px">
      <el-row>
        <el-form-item label="模板名称：" prop="tpl_name">
          <div>{{formData.tpl_name}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="模板代码：" prop="tag_command">
          <div>{{formData.tag_command}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="部门：">
          <div>{{formData.tpl_deparment}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="图例：">
          <div class="imgDiv">
            <div>
              <img :src="this.imgData" alt="" style="height: 200px;">
            </div>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注：">
          <div>{{formData.tpl_memo}}</div>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button  @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
// import moment from 'moment'
export default {
  props: {
    visable: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      loading: false,
      formItem: {},
      imgData: null
    }
  },
  mounted () {
    if (this.formData.img) {
      this.imgData = this.formData.img
    }
  },
  methods: {
    handleClose () {
      this.$emit('closeDialog')
      this.$refs.submitForm.resetFields()
    },
    handleSubmit () {
    }
  },
  components: {
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/base.scss';

.el-dialog__header{background: #f6f6f6;border-bottom: 1px solid #ddd;}
.el-dialog__footer{border-top:1px solid #ddd;}
// .model .el-form{width:380px;margin: 0 auto;}
.asset-tpl-add .el-form-item .el-form-item {
  margin-bottom: 22px;
}
</style>
