<template>
<div class="main">
  <navbar></navbar>
  <sidebar></sidebar>
  <div class="main__wrapper">
    <h3>{{title}}</h3>
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- <keep-alive> -->
      <router-view class="main__view" ></router-view>
    <!-- </keep-alive> -->
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    </el-breadcrumb>
    <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
      <router-view class="main-view animated"></router-view>
    </transition> -->
  </div>
</div>
</template>

<script>
import navbar from '@/components/common/navbar.vue'
import sidebar from '@/components/common/sidebar.vue'
import {
  mapGetters
} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'currentMenu'
    ]),
    title () {
      let menu = [].concat(this.currentMenu)
      menu.push({
        title: 'assetBindCheck',
        name: '盘点清单'
      })
      for (let i = 0; i < menu.length; i++) {
        let m = menu[i]
        if (m.title && m.title === this.$route.name) {
          return m.name
        } else if (m.path === this.$route.path) {
          return m.name
        }
      }
    }
  },
  components: {
    navbar,
    sidebar
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import '../assets/styles/base.scss';

@include b(main) {
  @include e(wrapper) {
    margin-left: $global-sidebar-width;
    padding: $global-gap*2 + $global-navbar-height $global-gap*2 $global-gap*2;
    > h3 {
      -webkit-margin-before: 0;
      -webkit-margin-after: 0;
      border-left: 4px solid #20a0ff;
      padding-left: $global-gap;
      margin-bottom: $global-gap * 2;
    }
  }
  @include e(view) {
    background: #fff;
    padding: $global-gap*3;
    box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
  }
  .el-breadcrumb {
    margin-bottom: $global-gap*2;
  }
}
</style>
