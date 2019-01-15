<template>
  <div class="main">
    <navbar></navbar>
    <sidebar></sidebar>
    <div class="main__wrapper" style="margin-left: 150px;padding: 80px 16px 16px;">
        <router-view></router-view>
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
  