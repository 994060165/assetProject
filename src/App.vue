<template>
<div id="app">
  <router-view></router-view>
</div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import '~normalize.css';
@import './assets/styles/common.css';
body{
  margin: 0;
}
p{
  -webkit-margin-before: .5em;
  -webkit-margin-after: .5em;
}
</style>
