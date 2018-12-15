<template>
<div class="datagrid">
  <el-row>
    <div class="datagrid__action">
        <slot name="action"></slot>
        <el-button type="primary" v-if="searchForm" @click="formShow = !formShow"><i :class="formShow?'el-icon-arrow-down':'el-icon-arrow-left'"></i>高级</el-button>
      
    </div>
  </el-row>
  <el-row v-if="searchForm">
    <el-form ref="searchForm" label-width="100px" :model="searchForm"  v-show="formShow">
      <slot name="form"></slot>
      <el-row class="text-right">
        <el-button type="primary" @click="handleSearch">筛选</el-button>
      </el-row>
    </el-form>
  </el-row>
  <el-row>
    <el-table ref="table" :data="table.data" v-loading="table.loading" element-loading-text="数据加载中，请稍候..." style="width:100%" @selection-change="handleSelectionChange">
      <slot name="table"></slot>
    </el-table>
  </el-row>
  <el-row v-if="paging && table.data.length > 0">
    <el-pagination :layout="page.layout" :current-page="page.currentPage" :page-size="page.pageSize" :total="page.total" @current-change="handleCurrentChange"></el-pagination>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'datagrid',
  props: {
    searchForm: Object,
    serverPage: {
      type: Boolean,
      default: false
    },
    paging: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      required: false
    }
  },
  watch: {
    tableData: function (newValue, oldValue) {
      if (this.serverPage) {
        this.table.data = newValue
      } else {
        if (newValue.length > this.page.pageSize) {
          this.table.data = newValue.slice(0, this.page.pageSize)
        } else {
          this.table.data = newValue
        }
        this.page.total = newValue.length
        this.page.currentPage = 1
      }
    }
  },
  data () {
    return {
      table: {
        data: [],
        loading: false
      },
      formShow: false,
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        layout: 'total, ->, prev, pager, next'
      }
    }
  },
  methods: {
    handleCurrentChange (val) {
      if (this.page.currentPage !== val) {
        this.page.currentPage = val
        if (this.serverPage) {
          this.table.loading = true
          this.$emit('handleSearch')
        } else {
          this.table.data = this.tableData.slice(this.page.pageSize * (val - 1), this.page.pageSize * val)
        }
      }
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    handleSearch () {
      this.table.loading = true
      this.page.currentPage = 1
      this.$emit('handleSearch', true)
    }
  }
}
</script>
<style lang="scss">
@import '../../assets/styles/base.scss';

.datagrid{
  .el-form-item{
    margin-bottom: $global-gap * 2;
  }
  .el-form-item__content{
    line-height: inherit;
  }
  .el-select, .el-date-editor, .el-input-number{
    width: 100%;
  }
  .el-pagination{
    padding: $global-gap 0 0;
  }
  &__action:not(:empty){
    padding-bottom: $global-gap;
  }
}
</style>
