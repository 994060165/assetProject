<template>
  <div class="corpusUpload">
    <el-row class="setTypeDiv">
      <!-- 左侧区域 -->
      <el-col :span="24" class="costBorder uploadLeft">
        <el-col :span="8">
          <!-- <el-row>
            <input @change="changeFiles"  type="file">
          </el-row> -->
          <el-row class="p-b-10">
              <a class="padding-5 el-button--success" style="text-decoration: none;border-radius: 3px;" href="/asset/Public/assets导入模板.xlsx" download="下载模板">下载模板</a>
          </el-row>
          <el-row>请选择您要上传的文件：</el-row>
            <el-upload class="upload-demo" ref="upload" 
              action="" 
              :on-preview="handlePreview" 
              :before-upload="beforeUpload"
              :on-progress="uploadProgress"
              :on-remove="handleRemove"
              :on-error="uploadError"
              :on-success="uploadSuccess"
              :on-change="changeFile"
              :multiple="true"
              :file-list="fileList" 
              :auto-upload="false">
            <el-button slot="trigger" type="primary" v-if="uploadShow">选取文件</el-button>
          </el-upload>
        </el-col>
        <el-progress type="circle" :percentage="uploadProgressStr"></el-progress>
      </el-col>
      <div>
        <el-button style="margin-left: 40%;width: 15%;" type="success" @click="submitUpload">批量上传</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import {TokenAPI} from '@/request/TokenAPI'
import $ from 'jquery'
export default {
  data () {
    return {
      size: 0,
      uploadShow: true,
      uploadData: {
        data: []
      },
      uploadProgressStr: 0,
      formData: new FormData(),
      fileList: [],
      date: new Date(),
      form: {
        userid: '',
        status: 'reviewing',
        authorname: '',
        createrName: ''
      },
      token: TokenAPI.getToken()
    }
  },
  watch: {
  },
  mounted () {
    this.form.filetime = `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}`
  },
  methods: {
    // 点击上传的函数
    submitUpload () {
      this.$refs.upload.submit()
      setTimeout(() => {
        this.upload()
      }, 1000)
    },
    uploadProgress (event, file, fileList) {
      console.log(file)
      this.uploadProgressStr = file.percentage.toFixed(0)
    },
    // 上传文件之前为了与后端内容匹配需要预处理
    beforeUpload (file) {
      console.log(file)
      this.formData.append(`file${this.size}`, file)
      this.size += 1
      return false
    },
    upload () {
      var xhrOnProgress = function (fun) {
        xhrOnProgress.onprogress = fun // 绑定监听
        // 使用闭包实现监听绑
        return function () {
          // 通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
          var xhr = $.ajaxSettings.xhr()
          // 判断监听函数是否为函数
          if (typeof xhrOnProgress.onprogress !== 'function') {
            return xhr
          }
          // 如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
          if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress
          }
          return xhr
        }
      }
      if (this.size === 0) {
        this.$message({
          type: 'warning',
          message: '请选择文件'
        })
      } else {
        this.formData.append('token', this.token)
        let formData = this.formData
        let that = this
        $.ajax({
          url: '/asset/res/index/uploadAsset',
          type: 'post',
          processData: false,
          contentType: false,
          data: formData,
          xhr: xhrOnProgress(function (e) {
            console.log('e', e)
            let percent = parseFloat((e.loaded / e.total * 100 | 0))
            that.uploadProgressStr = percent
          }),
          success: function (resData) {
            console.log(resData)
            let data = resData[0]
            that.formData = new FormData()
            that.size = 0
            if (data.ID === '-1') {
              that.$message({
                type: 'error',
                message: `${data.msg}`
              })
            } else {
              that.$message({
                type: 'success',
                message: `上传成功!插入表中${data.savaRows}条。`
              })
            }
          }
        })
      }
    },
    upload1 () {
      var config = {
        headers: {
          'Content-Type': 'multipart/form-data'
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          // 'Content-Type': 'application/json'
          // 'token': `${window.sessionStorage.getItem('token')}`
        },
        onUploadProgress: progressEvent => {
          var complete = parseFloat((progressEvent.loaded / progressEvent.total * 100 | 0))
          this.uploadProgressStr = complete
          console.log(this.uploadProgressStr)
        }
      }
      this.formData.append('token', this.token)
      console.log(this.token)
      console.log(this.formData.get('token'))
      console.log(this.formData.get('file0'))
      // let params = {
      //   token: this.token,
      //   file: this.formData
      // }
      axios.post(`/res/index/uploadAsset`, this.formData, config).then((res) => {
        let data = res.data
        this.formData = new FormData()
        this.uploadData.data = this.formData
        this.size = 0
        if (data.ID === '-1') {
          this.$message({
            type: 'error',
            message: `${data.msg}`
          })
        } else {
          this.$message({
            type: 'success',
            message: `上传成功!其中错误数据${data.ErrorRow.length}条，插入files表中条。`
          })
        }
      }, err => {
        this.formData = new FormData()
        this.uploadData.data = this.formData
        this.size = 0
        console.log(err)
        this.$message({
          type: 'error',
          message: `上传失败`
        })
      })
    },
    // 点击已上传列表时 可以通过file.response从服务端拿到数据
    handlePreview (file) {

    },
    changeFile (file, fileList) {
      if (fileList.length > 0) {
        this.uploadShow = false
      } else {
        this.uploadShow = true
      }
    },
    // 上传失败
    uploadError (err, file, fileList) {
      console.log(err, file, fileList)
    },
    // 上传成功
    uploadSuccess (res, file, fileList) {
    },
    handleRemove (file, fileList) {
      if (fileList.length > 0) {
        this.uploadShow = false
      } else {
        this.uploadShow = true
      }
    },
    handleSHKlChange () {
    },
    handleSHKLevelChange () {
    },
    changeFiles (event) {
      // let reader = new FileReader()
      let files = event.target.files[0]
      let formData = new FormData()
      console.log(files)
      formData.append('file', files)
      formData.append('token', this.token)
      this.uploadFilesAll(formData)
    },
    uploadFilesAll (formData) {
      var config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          var complete = parseFloat((progressEvent.loaded / progressEvent.total * 100 | 0))
          this.uploadProgressStr = complete
          console.log(this.uploadProgressStr)
        }
      }
      console.log(formData.get('token'))
      axios.post(`/res/index/uploadAsset`, formData, config).then((res) => {
        if (res.data.status === 'success') {
        }
      })
    }
  },
  components: {
    /* 注册组件 */
  }
}
</script>

<style>
.corpusUpload .upload-demo .el-upload--text{
  position: relative;
  left: 180px;
  bottom: 30px;
}
.corpusUpload .upload-demo .el-upload-list--text {
  position: relative;
  bottom: 30px;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 .corpusUpload {
  .el-select {
    width: 260px;
  }
  .el-input {
    width: 260px;
  }
}
// 页面总体样式
.corpusUpload {
  padding: 15px 15px 5px 15px;
  background: #fff;
  // 页面设置部分
  .setTypeDiv {
    margin-top: 20px;
  // 页面布局的边框样式
    .costBorder {
      // border: 1px solid #dfe6ec;
      min-height: 400px;
      padding: 40px 10px 10px 20px;
    }
    // 左侧设置部分
    .uploadLeft {
      .uploadTitle {
        display: inline-block;
        width: 200px;
        padding: 5px;
      }
    }
    // 右侧表单区域
    .uploadUserInfo {
      margin-top: -20px;
      margin-left: -20px;
      .timeFormItem {
        margin-bottom: 0px;
        .timeSpan {
          display: block;
          color: #bbbbbb;
        }
      }
    }
  }
}
</style>