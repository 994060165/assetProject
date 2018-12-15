<template>
<div class="asset-tpl-add">
  <el-dialog title="查看设备" class="model" :visible="visable" :before-close="handleClose" :modal="true" :close-on-press-escape="false" :close-on-click-modal="false" >
    <el-form :model="formData" ref="submitForm" label-width="120px">
      <el-row>
        <el-form-item label="设备标识：" prop="name">
          <div>{{formData.rdkey}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="终端名称：" prop="code">
          <div>{{formData.reader_name}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="终端类型：">
          <div>{{formData.reader_type}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="设备厂商：">
          <div>
            {{formData.maker_name}}
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="设备型号：">
          <div>{{formData.model_num}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="设备地址：">
          <div>{{formData.location}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="所属部门：">
          <div>{{formData.deparment}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="启用日期：">
          <div>{{formData.start_time}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="启用状态：">
          <div>{{formData.status}}</div>
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
      formItem: {}
    }
  },
  mounted () {
    this.formItem = this.formData.formItem
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
