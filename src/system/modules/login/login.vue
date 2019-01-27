<template>
    <div id="login-main">
      <div id="login-top">
        <h1 class="login-logo"></h1>
        <div class="formDiv">
          <div class="styleone-login-line">
            <div class="styleone-login-left">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="账户登录" name="first">
                  <loginForm></loginForm>
                <el-row class="padding-10">
                  <span class="font-14 color-blue cursor-pointer text-left" @click="gotoEscience">科技云通行证登录</span>
                  <span class="font-14 color-blue cursor-pointer pull-right" @click="getPassWord">找回密码</span>
                </el-row>
                </el-tab-pane>
                <el-tab-pane label="注册账户" name="second">
                  <el-button type="primary" size="large" class="register" @click.native="register">用户注册</el-button>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <register
      :form = "formData"
      :formVisible = "formVisible"
      :tableTitle = "tableTitle"
      @upload = "upload"
      @addCancel = "addCancel">
      </register>
      <el-row>
        <el-dialog :visible="getPWDialog" :close-on-click-modal="false"  :before-close="dialogClose">
          <el-row v-if="!YZCode">
            <el-form label-width="160px" ref="form">
              <el-form-item label="用户ID：" required>
                <el-input v-model="UserID" auto-complete="off" placeholder="【请输入您的用户ID！】"></el-input>
              </el-form-item>
            </el-form>
            <el-row class="padding-10 text-center">
              <el-button type="primary" @click="getYZCode">获取验证码</el-button>
            </el-row>
          </el-row>
          <el-row v-if="YZCode">
            <el-form :model="reForm" label-width="160px" ref="reForm" :rules="formRules">
              <el-form-item label="用户ID：" prop="UserID">
                <!-- <el-input v-model="reForm.UserID" auto-complete="off" placeholder="【请输入4-25位的数字英文组合！】"></el-input> -->
                <span>{{reForm.UserID}}</span>
              </el-form-item>
              <el-form-item label="验证码：" prop="Code" >
                <el-input v-model="reForm.Code" auto-complete="off" class="w-200" placeholder="【请输入获取到的验证码！】"></el-input>
              </el-form-item>
              <el-form-item label="密码：" prop="Password" >
                <el-input v-model="reForm.Password" :type="psType" class="w-200" auto-complete="off">
                </el-input>
                <i class="el-icon-view" @mousedown="psType = 'text'" @mouseup="psType = 'password'"></i>
              </el-form-item>
              <el-form-item label="确认密码：" prop="repassword" >
                <el-input v-model="reForm.repassword" type="password" class="w-200" auto-complete="off" placeholder="【确认密码】"></el-input>
              </el-form-item>
            </el-form>
            <el-row>
              <el-button @click="refreshPW">确定</el-button>
            </el-row>
          </el-row>
        </el-dialog>
      </el-row>
    </div>
</template>

<script>
import loginForm from './loginForm.vue'
import register from './register.vue'
export default {
  data () {
    return {
      activeName: 'first',
      formData: {
      },
      formVisible: false,
      tableTitle: '新用户注册',
      psType: 'password',
      getPWDialog: false,
      UserID: '',
      YZCode: false,
      reForm: {},
      formRules: {
        Code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ],
        Password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // this.goEscience()
  },
  methods: {
    // 切换tab
    handleClick () {
      console.log(this.activeName)
    },
    // 显示用户注册弹窗
    register () {
      this.formVisible = true
      this.formData = {
      }
    },
    // 注册用户
    upload () {
      this.formVisible = false
    },
    // 取消注册
    addCancel () {
      this.formVisible = false
      this.form = {}
    },
    gotoEscience () {
      console.log('hahah')
      window.location.href = 'https://passport.escience.cn/oauth2/authorize?response_type=code&theme=full&client_id=92658&redirect_uri=http://159.226.186.90/asset/index/escienceAuthLogin'
    },
    // 找回密码
    getPassWord () {
      this.getPWDialog = true
    },
    // 获取验证码
    getYZCode () {
      let params = {
        UserID: this.UserID
      }
      this.$request.post('/sys/index/getPassword', params).then(res => {
        let data = res.data
        if (data.ID === '1') {
          this.$message({
            type: 'success',
            message: '邮件已发送成功，请您尽快填写验证码！'
          })
          this.YZCode = true
          this.reForm.UserID = params.UserID
        } else {
          this.$message({
            type: 'error',
            message: `邮件发送失败，${data.msg}！`
          })
        }
      })
    },
    // 验证码获取成功之后
    refreshPW () {
      let params = Object.assign({}, this.reForm)
      this.$request.post('/sys/index/changePassswordToCode', params).then(res => {
        let data = res.data
        if (data.ID !== '-1') {
          this.$message({
            type: 'success',
            message: '密码找回成功，请使用新密码进行登录！'
          })
          this.getPWDialog = false
        } else {
          this.$message({
            type: 'error',
            message: `密码设置失败，${data.msg}`
          })
        }
      })
    },
    dialogClose () {
      this.getPWDialog = false
      this.UserID = ''
      this.YZCode = false
      this.reForm = {}
    }
  },
  components: {
    loginForm, register
  }
}
</script>

<style lang="scss" scoped>
img{
  border: 0
}
#login-main {
    width: 100%;
    height: 100%;
    position:relative;
    #login-top {
        background-image: url("../../assets/img/desk/login/logbg.jpg");
        // background-repeat: no-repeat;
        // background-position: center top;
        // background-size: cover;
        // width: 100%;
        // height: 95%;
        // background-image: url("../assets/img/desk/login/logbg2.jpg");
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
        width: 100%;
        height: 95%;
        position: fixed;
        .login-logo{background:url("../../assets/img/desk/login/login-logo.png") no-repeat 6% center; height: 100px;}
    }
    #login-bottom{
      text-align: center;
      line-height: 100%;
      width: 100%;
      height: 8%;
      .footer{
        display: inline-block;
        font-size: 12px;
        margin-top: 19px;
        font-family: "微软雅黑";
      }
    }
    .formDiv {
      position: absolute;
      top: 27%;
      right: 6%;
      width: 355px;
      height: 300px;
      background-color: #fff;
      padding-bottom: 20px;
        .styleone-login-line{
          position: relative;
          z-index: 1;
          padding: 35px 0 30px;
          width: 290px;
          margin: 0 auto;
          float: none;
          .styleone-login-left{
            float: none;
            .loginTitle {
              width: 100%;
              height: 40px;
              border-bottom: 1px solid #ddd;
              margin-bottom: 0;
              float: none;
              .zhdlym{
                height: 38px;
                line-height: 38px;
                text-align: center;
                background: #fff;
                font-size: 16px;
                color: black;
                border-bottom: none;
                border-radius: 0;
                width: auto;
                padding: 0 15px;
                cursor: pointer;
                float: left;
                font-weight: 700;
                font-family: "微软雅黑","Microsoft Yahei",'Open Sans',sans-serif
              }
        }
            .loginForm{
              position: relative;
              display: block;
            }
          }
        }
        .smewm{
          padding: 18% 8%;
          p{
            text-align: center;
            color: #2a3f5b;
            font-size: 18px;
            margin: 0 0 10px;
            font-family: "微软雅黑";
            font-weight: 300;
          }
        }
        .ewmrigt{
          width: 40px;
          height: 40px;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 5;
          .login-style-ewm{
            display: block;
            width: 40px;
            height: 40px;
            background: url(../../assets/img/desk/login/login-ewm-1.jpg) center center no-repeat #fff;
          }
          .login-style-ewm-back{
            display: block;
            width: 40px;
            height: 40px;
            background: url(../../assets/img/desk/login/login-ewm-3.jpg) center center no-repeat #fff;
          }
        }
    }
}
.register {
  width: 200px;
  padding: 10px;
  margin: 60px 0 0 40px;
}
.el-dialog__header{background: #f6f6f6;border-bottom: 1px solid #ddd;height: 18px;}
</style>