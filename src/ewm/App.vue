<template>
  <div>
    <router-view></router-view>
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
  