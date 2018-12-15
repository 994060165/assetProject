<template>
<div class="asset-tpl-add">
  <el-dialog title="新建模板" class="model" :visible="visable" :before-close="handleClose" :modal="true" :close-on-press-escape="false" :close-on-click-modal="false" >
    <el-form :model="formData" ref="submitForm" label-width="120px">
       <el-row>
        <el-form-item label="设备标识：">
          <div>{{formData.rdkey}}</div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="终端名称：" prop="reader_name">
          <el-input v-model="formData.reader_name"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="终端类型：">
          <el-input v-model="formData.reader_type"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="设备厂商：">
          <el-input v-model="formData.maker_name"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="设备型号：">
          <el-input v-model="formData.model_num"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="设备地址：">
          <el-input v-model="formData.location"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="所属部门：">
          <el-input v-model="formData.deparment"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="启用状态：">
          <el-select v-model="formData.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button  @click="handleClose">关 闭</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit()">确认</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import moment from 'moment'
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
      options: [
        {
          label: '启用',
          value: '启用'
        },
        {
          label: '待审核',
          value: '待审核'
        },
        {
          label: '停用',
          value: '停用'
        }
      ]
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
      let params = this.formData
      // params.reader_id = '7'
      // if (params.status === '启用') {
      params.start_time = moment(new Date()).format('YYYY-MM-DD')
      // }
      this.$request.post(`/res/index/putReaderRegist`, params).then(res => {
        let data = res.data
        if (data.ID === '1') {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '保存失败'
          })
        }
        this.$emit('successFun')
      }, err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      })
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
