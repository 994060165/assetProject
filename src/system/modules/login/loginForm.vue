<template lang="html">
<div>
  <el-form ref="form" :model="form" class="loginForm">
    <div class="styleone-tx" v-show="errorMessage">
      <img src="../../assets/img/desk/login/login-error.png">
      <span class="ng-binding" v-html="errorM"></span>
    </div>
    <div class="input-group">
      <span class="input-group-addon">
        <img alt="" src="../../assets/img/desk/login/login-user.png">
      </span>
      <input class="ueserinput"  v-model="form.loginCode"  placeholder="邮箱\手机号\用户名" type="text" @keyup.enter="onSubmit">
    </div>
    <div class="input-group">
    <span class="input-group-addon">
      <img alt="" src="../../assets/img/desk/login/login-pwd.png">
    </span>
    <input class="ueserinput"  v-model="form.userPsw"  placeholder="密码" type="password" @keyup.enter="onSubmit">
  </div>
  <div class="input-group yzmsr" v-show='showIdentifyingCode'>
    <span class="yzmwz">验证码:</span>
    <input class="usercode" name="" v-model="form.identityingCode" placeholder="输入验证码" type="text" @keyup.enter="onSubmit">
  <img alt="加载验证码" class="yzmtp" @click="refresh()" :src="codeUrl"/>
  </div>
  <el-button class="btn-login" id="common" type="submit"  @click="onSubmit" style="margin-top:10px;">登录</el-button>
  </el-form>
</div>
</template>

<script>
import Vue from 'vue'
export default {
  data () {
    return {
      errorM: '',
      errorMessage: false,
      showIdentifyingCode: false,
      showEwm: false,
      codeUrl: '',
      form: {
        identityingCode: '',
        loginCode: '',
        userPsw: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    onSubmit () {
      let params = {
        UserID: this.form.loginCode,
        Password: this.form.userPsw
        // Password: this.$md5(this.form.userPsw)
      }
      this.$request.post(`/sys/index/login`, params).then(res => {
        let data = res.data
        if (data.stats === '1') {
          let users = data.data.userinfo
          let userInfo
          for (let user in users) {
            userInfo = users[user]
          }
          if (data.data.Roleinfo) {
            let roleList = data.data.Roleinfo.data
            let roleobj = {}
            roleList.forEach(value => {
              roleobj[value.RoleID] = value
            })
            let roleArr = []
            for (let item in roleobj) {
              roleArr.push(roleobj[item])
            }
            window.sessionStorage.setItem('roleList', JSON.stringify(roleArr))
          }
          if (data.data.Orginfo) {
            window.sessionStorage.setItem('org', JSON.stringify(data.data.Orginfo[0]))
          }
          window.sessionStorage.setItem('token', data.token)
          window.sessionStorage.setItem('menu', JSON.stringify(data.data.treelist))
          window.sessionStorage.setItem('user', JSON.stringify(userInfo))
          Vue.prototype.$userInfo = userInfo
          setTimeout(() => {
            this.$router.push({
              path: '/dashboard'
            })
          }, 100)
        } else {
          this.errorMessage = true
          this.errorM = data.msg
        }
      })
    },
    refresh () {
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
img{
  border: 0
}
#login-main {
    width: 100%;
    height: 100%;
    position:relative;
    .loginForm{
      position: relative;
      display: block;
    }

.loginForm {
  padding-top:15px;
  margin-top: 10px;
  width: 100%;
  .el-form-item {
    width: 260px;
  }
  .loginBtn {
    padding: 10px 112px;
  }
  .input-group{
    width: 288px;
    height: 35px;
    border: 1px solid #ddd;
    background: #fff;
    margin-bottom: 20px;
    .input-group-addon{
      display: block;
      width: 32px;
      height: 35px;
      padding: 0;
      border-radius: 0;
      border: none;
      float: left;
      background: #e5e5e5;
      margin: 0;
    }
    .ueserinput{
      border: none;
      border-radius: 0;
      width: 232px;
      height: 34px;
      line-height: 34px;
      padding: 0 10px;
      float: left;
    }
  }
  .styleone-tx{
    border: none;
    margin: 0;
    height: 30px;
    line-height: 30px;
    background: 0 0;
    max-width: 100%;
    position: absolute;
    top: -15px;
    padding: 0;
    font-weight: 400;
    vertical-align: middle;
    .ng-binding{
      color: red;
    }
  }
  .yzmsr{
    border:none;
    float: right;
    line-height: 31px;
    vertical-align: middle;
    font-family: "微软雅黑","Microsoft Yahei",'Open Sans',sans-serif;
    .yzmwz{
      color: #333;
      font-size: 14px;
      font-weight: 400;
      display: inline-block;
    }
    .usercode{
      border-radius: 0;
      width: 110px;
      height: 34px;
      line-height: 34px;
      border: 1px solid #ddd;
      padding: 0 10px;
      margin-right: 10px;
    }
    .yzmtp{
      float: none;
      border: 0;
      height: 30px;
      border-radius: 6px;
      vertical-align: middle;
      line-height: 28px;
    }
  }
  .btn-login{
    margin-top: 10px;
    float: none;
    padding: 0;
    height: 36px;
    width: 100%;
    margin-left: 1%;
    font-weight: 700;
    line-height: 36px;
    color: #fff;
    font-size: 14px;
    border: none;
    background: #0181e4;
    border-radius: 0;
    box-shadow: none;
    display: inline-block;
    font-family: "微软雅黑";
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
  }
  .escience-link{
    cursor: pointer;
    padding-top: 10px;
    color: #4d81ad;
    float: right;
    font-family: "微软雅黑";
    font-size: 12px;
  }
}

}
</style>