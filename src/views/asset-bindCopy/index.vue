<template>
<div class="asset-bind">
  <datagrid ref="datagrid" :server-page="true" :table-data="allAssets" :search-form="searchForm" @handleSearch="handleSearch" @handleSelectionChange="handleSelectionChange">
    <template slot="form">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="资产名称">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="责任部门">
            <el-select filterable clearable v-model="searchForm.deparment" placeholder="请选择责任部门">
              <el-option v-for="(item, index) in allDeparments" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产最小价值">
            <el-input-number v-model="searchForm.minvalue" :min="0" :step="100"></el-input-number>
          </el-form-item>
          <el-form-item label="绑定状态">
            <el-select v-model="searchForm.bind_status">
              <el-option
              v-for="(item, index) in bindOption" :key="index"
              :label="item.label"
              :value="item.value">

              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产编号">
            <el-input v-model="searchForm.asset_num"></el-input>
          </el-form-item>
          <el-form-item label="责任人">
            <el-select filterable clearable v-model="searchForm.zrr_name" placeholder="请选择责任人">
              <el-option v-for="(item, index) in allPersons" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产最大价值">
            <el-input-number v-model="searchForm.maxvalue" :min="0" :step="100"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产标签号">
            <el-input v-model="searchForm.tag_num"></el-input>
          </el-form-item>
          <!-- <el-form-item label="父资产名称">
            <el-input v-model="searchForm.parent_name"></el-input>
          </el-form-item> -->
          <el-form-item label="启用日期">
            <el-date-picker v-model="searchForm.start_time" type="daterange" placeholder="选择领用日期范围"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <template slot="action">
      <!-- <el-button :disabled="disabledButton" type="primary" icon="plus" @click="$refs.bind.asset = multipleSelection">资产绑定</el-button> -->
      <el-input 
        placeholder="请输入资产名称/资产编码/责任部门/责任人"
        icon="search" v-model="keyword" @keyup.enter.native="handleEnter"
        >
        <el-button slot="append" icon="el-icon-search" @click="handleEnter"></el-button>
      </el-input>
    </template>
    <template slot="table">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="设备名称" width="100"></el-table-column>
      <el-table-column inline-template :context="_self" label="设备信息" width="180">
        <div>
          <div>{{row.name}}</div>
          <div>
            <label>品牌</label>
            <span>{{row.maker_name}}</span>
          </div>
          <div>
            <label>编码</label>
            <span>{{row.asset_num}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="model_num" label="设备型号"></el-table-column>
      <el-table-column prop="tag_num" label="设备标签码"></el-table-column>
      <el-table-column prop="location" label="设备位置"></el-table-column>
      <el-table-column inline-template :context="_self" width="100" label="操作">
        <div>
          <el-button @click="$refs.detail.asset = row" type="text" size="small">查看</el-button>
        </div>
      </el-table-column>
    </template>
  </datagrid>
  <bind ref="bind"></bind>
  <detail ref="detail"
    :visible="visible"
    @closeDialog="closeDialog"></detail>
</div>
</template>

<script>
import datagrid from '@/components/common/datagrid.vue'
import detail from '@/components/asset/detail.vue'
import bind from '@/views/asset-bind/_bind.vue'
import api from '@/api'
import moment from 'moment'
import {
  mapGetters
} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'allDeparments',
      'allPersons'
    ]),
    disabledButton () {
      return this.multipleSelection.length === 0
    }
  },
  components: {
    datagrid,
    bind,
    detail
  },
  mounted () {
    this.handleEnter()
  },
  data () {
    return {
      allAssets: [],
      keyword: '',
      visible: false,
      searchForm: {
        name: '',
        tag_num: '',
        parent_name: '',
        asset_num: '',
        deparment: '',
        zrr_name: '',
        minvalue: '',
        maxvalue: '',
        start_time: [],
        bind_status: '未绑定'
      },
      multipleSelection: [],
      bindOption: [
        {
          label: '已绑定',
          value: '已绑定'
        },
        {
          label: '未绑定',
          value: '未绑定'
        }
      ]
    }
  },
  methods: {
    handleEnter () {
      api.gettagbindlike(
        {
          keystr: this.keyword,
          page: this.$refs.datagrid.page.currentPage,
          pagesize: this.$refs.datagrid.page.pageSize
        }
      ).then(data => {
        this.allAssets = data.data
        this.$refs.datagrid.table.loading = false
        this.$refs.datagrid.page.total = data.count
        this.isFuzzy = true
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSearch (isSearch) {
      if (!this.isFuzzy || isSearch) {
        let _params = Object.assign({}, this.searchForm)
        if (this.searchForm.start_time[0]) {
          _params.minDate = moment(this.searchForm.start_time[0].getTime()).format('YYYY-MM-DD')
          _params.maxDate = moment(this.searchForm.start_time[1].getTime()).format('YYYY-MM-DD')
        }
        _params.page = this.$refs.datagrid.page.currentPage
        _params.pagesize = this.$refs.datagrid.page.pageSize
        api.gettagbind(_params).then(data => {
          this.allAssets = data.data
          this.$refs.datagrid.page.total = data.count
          this.$refs.datagrid.table.loading = false
          this.isFuzzy = false
        })
      } else {
        this.handleEnter()
      }
    },
    closeDialog () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.asset-bind{
  .datagrid__action {
    text-align: right;
    position: relative;
    .el-input{
      width: 400px;
    }
  }
}
</style>
