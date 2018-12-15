<template>
<div class="asset-tpl-add">
  <el-dialog title="新建模板" class="model" :visible="visable" :before-close="handleClose" :modal="true" :close-on-press-escape="false" :close-on-click-modal="false" >
    <el-form :model="formData" ref="submitForm" label-width="120px">
      <el-row>
        <el-form-item label="模板名称：" prop="tpl_name">
          <el-input v-model="formData.tpl_name"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="模板代码：" prop="tag_command">
          <el-input 
            type="textarea"
            autosize
            v-model="formData.tag_command"></el-input>
        </el-form-item>
      </el-row>
      <!-- <el-row>
        <el-form-item label="标签规格：">
          <el-form :model="formItem" label-width="100px">
            <el-row class="formItem">
              <el-col :span="12">
                <el-form-item label="底纸长：">
                  <el-input v-model="formItem.length"></el-input>
                </el-form-item>
                <el-form-item label="底纸宽：" prop="width">
                  <el-input v-model="formItem.width"></el-input>
                </el-form-item>
                <el-form-item label="间隙：" prop="jx">
                  <el-input v-model="formItem.jx"></el-input>
                </el-form-item>
                <el-form-item label="可打印区宽：" prop="dyqk">
                  <el-input v-model="formItem.dyqk"></el-input>
                </el-form-item>
                <el-form-item label="可打印区长：" prop="dyqc">
                  <el-input v-model="formItem.dyqc"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="epc长度：" prop="epcLen">
                  <el-input v-model="formItem.epcLen"></el-input>
                </el-form-item>
                <el-form-item label="打印面料：" prop="dyml">
                  <el-input v-model="formItem.dyml"></el-input>
                </el-form-item>
                <el-form-item label="打印底纸：" prop="dydz">
                  <el-input v-model="formItem.dydz"></el-input>
                </el-form-item>
                <el-form-item label="配套碳带：" prop="pttd">
                  <el-input v-model="formItem.pttd"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-form-item>
      </el-row> -->
      <el-row>
        <el-form-item label="部门：">
          <el-input
            type="textarea"
            autosize
            v-model="formData.tpl_deparment">
          </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="图例：">
          <div class="imgDiv" v-if="(!!this.imgData)">
            <div>
              <img :src="this.imgData" alt="">
            </div>
            <el-button type="primary" @click="changeImg">更换图片</el-button>
          </div>
          <el-upload
            action=""
            ref="upload"
            :multiple="false"
            :before-upload="beforeUpload"
            :limit="1"
            v-else
            :file-list="fileList">
            <el-button size="small" type="text"><i class="el-icon-upload2 upload" @clik="submitUpload"></i>点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            autosize
            v-model="formData.tpl_memo">
          </el-input>
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
      fileList: [],
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
      this.imgData = null
      this.$refs.submitForm.resetFields()
    },
    handleSubmit () {
      let params = Object.assign({}, this.formData)
      params.img = this.imgData
      params.token = window.sessionStorage.getItem('token')
      this.$request.post('/res/index/putTpl', params).then(res => {
        let data = res.data
        if (data.ID === '-1') {
          this.$message({
            type: 'error',
            message: `${data.msg}`
          })
        } else {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.handleClose()
        }
      })
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    beforeUpload (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      var that = this
      let fileData = null
      reader.onloadend = function () {
        fileData = reader.result
        that.imgData = fileData
      }
      return false
    },
    changeImg () {
      this.imgData = null
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
.imgDiv {
  div{
    height:230px;
    background: #49567d;
    position: relative;
    padding:14px 14px 44px;
    overflow: hidden;
    border-radius:4px;
    img{
      max-width:100%;
      max-height:100%;
      width: 100%;
      height: 100%;
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
