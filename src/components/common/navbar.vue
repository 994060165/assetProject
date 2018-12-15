<template>
<div class="main__navbar">
  <el-row>
    <el-col :span="12">
      <h2></h2>
    </el-col>
    <el-col :span="12">
      <!--<a href="#">关于</a>-->
      <span @click="logout" style="cursor: pointer; color: white;">退出</span>
      <!-- <router-link to="/login">退出</router-link> -->
    </el-col>
  </el-row>
  <!-- <el-dropdown>
    <span class="el-dropdown-link">
      管理员<i class="el-icon-caret-bottom el-icon-right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>
        <router-link to="/password">修改密码</router-link>
      </el-dropdown-item>
      <el-dropdown-item class="divider">
        <router-link to="/logout">退出</router-link>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown> -->
</div>
</template>

<script>
// import {
//   mapGetters
// } from 'vuex'

export default {
  // computed: {
  //   ...mapGetters([
  //     'currentUser'
  //   ])
  // },
  data () {
    return {

    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/base.scss';

.main__navbar {
  position: fixed;
  height: $global-navbar-height;
  // background: -webkit-linear-gradient(#004bc1, #0858d8); /* Safari 5.1 - 6.0 */
  // background: -o-linear-gradient(#004bc1, #0858d8); /* Opera 11.1 - 12.0 */
  // background: -moz-linear-gradient(#004bc1, #0858d8); /* Firefox 3.6 - 15 */
  // background: linear-gradient(#004bc1, #0858d8); /* 标准的语法 */
  background: #0e9aef;
  min-width: 100%;
  z-index: 9999;
  box-shadow: 0 2px 3px hsla(0,0%,7%,.1),0 0 0 1px hsla(0,0%,7%,.1);
  .el-dropdown {
    color: #fff;
    float: right;
    padding: 0 $global-gap*3;
    height: $global-navbar-height;
    line-height: $global-navbar-height;
  }
  .el-icon-caret-bottom:before{
    line-height: $global-navbar-height;
  }
  .el-dropdown-item a {
    display: block;
  }
  h2{
    background: url(../../assets/images/logo.png) no-repeat 0 center;
    width:430px;
    height: 65px;
   margin-left: $global-gap * 8;
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    line-height: $global-navbar-height;
  }
  .el-col:last-of-type{
    text-align: right;
    line-height: $global-navbar-height;
    padding-right: $global-gap * 4;
  }
  a,a:focus{
    color: #fff;
    margin-left: $global-gap * 4;
    text-decoration: none;
  }
  a:hover{
    color: #fff;
    margin-left: $global-gap * 4;
    text-decoration: none;
  }
}
</style>
