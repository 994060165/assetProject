<template>
<div class="main__sidebar">
  <el-menu :router="true" :default-active="currentRouter">
    <!-- <el-submenu v-if="menu1.children" v-for="(menu1, index) in currentMenu" :key="index" :index="menu1.children[0].path">
      <template slot="title"><i :class="`el-icon-${menu1.icon}`"></i>{{menu1.FunName}}</template>
      <el-menu-item v-for="(menu2, index) in menu1.children" :key="index" :index="menu2.path">{{menu2.FunName}}</el-menu-item>
    </el-submenu>  v-else-->
    <el-menu-item  v-for="(menu1, index) in currentMenu" :key="index" :index="menu1.FunLink"><i :class="`el-icon-${menu1.icon}`"></i>{{menu1.FunName}}</el-menu-item>
  </el-menu>
</div>
</template>

<script>
export default {
  computed: {
  },
  data () {
    return {
      currentRouter: this.$router.history.current.fullPath,
      currentMenu: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      let data = JSON.parse(window.sessionStorage.getItem('menu'))
      let one = []
      let two = []
      let three = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].MenuLevelID === '2') {
          three.push(data[i])
        } else if (data[i].MenuLevelID === '1') {
          two.push(data[i])
        } else if (data[i].MenuLevelID === '0') {
          one.push(data[i])
        }
      }
      for (let m = 0; m < one.length; m++) {
        one[m].children = []
        for (let n = 0; n < two.length; n++) {
          if (two[n].FatherID === one[m].FunID) {
            one[m].children.push(two[n])
          }
        }
      }
      for (let j = 0; j < two.length; j++) {
        two[j].children = []
        for (let k = 0; k < three.length; k++) {
          if (three[k].FatherID === two[j].FunID) {
            two[j].children.push(three[k])
          }
        }
      }
      console.log(two)
      this.currentMenu = two
    },
    handleSelect (keyPath) {
      this.$router.push({
        path: keyPath
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/base.scss';

.main__sidebar {
    position: fixed;
    top: $global-navbar-height;
    left: 0;
    bottom: 0;
    width: $global-sidebar-width;
    max-height: 100vh;
    height: 100%;
    z-index: 1;
    background: #263548;
    box-shadow: 0 2px 3px hsla(0,0%,7%,.1),0 0 0 1px hsla(0,0%,7%,.1);
    overflow-y: auto;
    overflow-x: hidden;
    .el-menu {
        border-radius: 0;
        // height: 100%;
        padding-top: 10px;
        background: #263548;
        border: none;
        .el-menu-item,.el-menu-item:focus,.el-menu-item:visited,.el-menu-item:active{
          color:#fff;
          background: #263548;
          border-bottom:1px solid #2d435a;
          i{color: #fff;}
        }
        .el-menu-item:hover{
          background-color: #2d435a;
        }
    }
}
</style>
