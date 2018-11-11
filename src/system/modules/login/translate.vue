<template lang="html">
  <div>
    <div v-loading="loginLoading" element-loading-text="正在跳转中" class="tarnslateDiv">
      
    </div>
  </div>
</template>

<script>
import store from '../../../../store/store'
import { loginFun, loginBySystem } from '../../../../service/app'
import { eventBus, EVENT_LOGIN } from '../../../../service/EventBus'
import { gConfig } from '../../../../../static/data/config'
export default {
  data () {
    return {
      loginLoading: true,
      errorM: '',
      errorMessage: false,
      showIdentifyingCode: false,
      showEwm: false,
      base: gConfig.baseURL,
      codeUrl: '',
      form: {
        identityingCode: '',
        loginCode: '',
        userPsw: ''
      }
    }
  },
  mounted () {
    localStorage.setItem('loginErrorNo', '0')
    let token = this.$route.params.authToken
    this.translateLogin(token)
  },
  methods: {
    // 转换页登陆
    translateLogin (token) {
      loginBySystem(token).then(res => {
        let data = res.data
        eventBus.$emit(EVENT_LOGIN, data)
        store.commit('TOKEN_SET', JSON.stringify(data))
        this.setLoginUser(JSON.stringify(data))
        this.loginLoading = false
        this.$router.push({
          path: '/corpus/myOffice/1'
        })
        localStorage.setItem('loginshow', 'false')
      }, error => {
        console.log('cuowu', error)
        this.loginLoading = false
      })
    },
    onSubmit () {
      let params = this.form
      if (isNaN(parseInt(localStorage.getItem('loginErrorNo')))) {
        // 使用localStorage存储登陆错误次数
        localStorage.setItem('loginErrorNo', '0')
      }
      loginFun(params).then(data => {
        if (data.errorCode) {
          const self = this
          const loginErrorNo = parseInt(localStorage.getItem('loginErrorNo')) + 1
          if (loginErrorNo >= 3) {
            self.showIdentifyingCode = true
            self.refresh()
          }
          localStorage.setItem('loginErrorNo', loginErrorNo)
          self.errorMessage = true
          self.errorM = data.message
          setTimeout(function () {
            self.errorMessage = false
            self.errorM = ''
          }, 1000)
          self.errorMessage = true
          self.errorM = data.message
        } else {
          eventBus.$emit(EVENT_LOGIN, data)
          store.commit('TOKEN_SET', JSON.stringify(data))
          this.setLoginUser(JSON.stringify(data))
          this.$router.push({
            path: '/corpus/myOffice/1'
          })
          localStorage.setItem('loginshow', 'false')
        }
      }, error => {
        console.log('出现错误', error)
      })
    },
    refresh () {
      var self = this
      self.param = new Date().getTime()
      self.codeUrl = self.base + '/seed/api/identifyingCode/getCode?' + self.param
      self.identifyingCode = ''
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
.tarnslateDiv {
  text-align: center;
  width: 100%;
  height: 100%;
  position: static !important;
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
    top: 5px;
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