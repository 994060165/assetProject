<template>
<div class="login">
    <el-container>
        <el-main>
          <div class="main-form">
            <div class="login-logo"></div>
          <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
            <el-form-item label="">
              <span class="iconfont icon">&#xe63a;</span>
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="">
              <span class="iconfont icon">&#xe601;</span>
              <el-input v-model="formLabelAlign.region"></el-input>
            </el-form-item>
            <el-form-item label="" class="yzm">
              <span class="iconfont icon">&#xe8d1;</span>
              <el-input v-model="formLabelAlign.region"></el-input>
              <div class="yzm-con">1234</div>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="onSubmit">立即登录</el-button>
            <el-button>取消</el-button>
          </el-form-item>
          </el-form>
          </div>
        </el-main>
        <el-footer>@版权归中科院所有</el-footer>
    </el-container>
</div>
</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      }
    }
  }
}
</script>

<style lang="scss">
@import '../assets/styles/font/iconfont.css';
.login{
  width: 100%;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: url(../assets/images/login-bg.jpg) no-repeat center fixed;background-size: cover;
   .el-main{flex: 1;
    .main-form{width: 520px;margin: 0 auto;background-color: rgba(255,255,255,0.6);border: 1px solid #fff;box-shadow: 0 4px 4px rgba(0,0,0,0.3);padding-right:80px;padding-top:60px;padding-bottom:40px;margin-top:110px;
      .el-button--primary{background-color: #fcad51;color: #fff;border-color: #fcad51;}
      .yzm .el-input__inner{width: 70%;}
      .yzm .yzm-con{position: absolute;right: 0;top: 0;height: 40px;width:120px;background-color: #ffedd7;border:1px solid #fcad51;color:#fcad51;border-radius:4px;font-size: 24px;text-align: center;}
      .login-logo{background: url(../assets/images/login-logo.png) no-repeat center center;width: 440px;height: 50px;margin-left: 80px;margin-bottom: 20px;}
      .el-form-item__content{position: relative;}
      .el-input__inner{padding-left: 50px;border-color: #ddd;}
        span.icon{display: inline-block;width: 34px;height: 32px;position: absolute;left:10px;top:2px;z-index: 90;font-size: 26px;color: #999;}
        
    }
   }
   .el-footer{text-align: center;color: #327df4;}

}
</style>
