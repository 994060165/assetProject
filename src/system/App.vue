<template>
  <div class="main">
    <navbar></navbar>
    <sidebar></sidebar>
    <div class="main__wrapper">
        <router-view class="main__view" ></router-view>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import navbar from '@/components/common/navbar.vue'
  import sidebar from '@/components/common/sidebar.vue'
  export default {
    name: 'sys',
    data () {
      return {
      }
    },
    mounted () {
    },
    computed: {
    },
    watch: {
    },
    methods: {
    },
    created () {
    },
    components: {
      /* 注册组件 */
      navbar, sidebar
    }
  }
</script>
  