<template>
<div class="asset-search">
  <datagrid ref="datagrid"
    :server-page="true"
    :table-data="allAssets"
    :search-form="searchForm"
    @handleSearch="handleSearch">
    <template slot="form">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="资产名称">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="部门">
            <el-input v-model="searchForm.deparment" placeholder="请选择部门"></el-input>
            <!-- <el-select  filterable clearable>
              <el-option v-for="(item, index) in allDeparments" :key="index" :label="item" :value="item"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="资产最小价值">
            <el-input-number v-model="searchForm.minvalue" :min="0" :step="100"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产编号">
            <el-input v-model="searchForm.asset_num"></el-input>
          </el-form-item>
          <el-form-item label="责任人">
            <el-select filterable clearable v-model="searchForm.person" placeholder="请选择责任人">
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
          <el-form-item label="父资产名称">
            <el-input v-model="searchForm.parent_name"></el-input>
          </el-form-item>
          <el-form-item label="启用日期">
            <el-date-picker v-model="searchForm.start_time" type="daterange" placeholder="选择领用日期范围"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <template slot="action">
      <el-input 
        placeholder="请输入资产名称/品牌/标签号/型号/责任部门/责任人"
        v-model="keystr" @keyup.enter.native="handleEnter">
        <el-button slot="append" icon="el-icon-search" @click="handleEnter"></el-button>
      </el-input>
    </template>
    <template slot="table">
      <el-table-column prop="name" label="设备名称" width="100"></el-table-column>
      <el-table-column label="设备信息" width="180">
        <template slot-scope="scope">
            <div>{{scope.row.name}}</div>
            <div>
              <label>品牌</label>
              <span>{{scope.row.maker_name}}</span>
            </div>
            <div>
              <label>资产编号</label>
              <span>{{scope.row.asset_num}}</span>
            </div>
        </template>
      </el-table-column>
      <el-table-column prop="tag_num" label="设备标签号"></el-table-column>
      <el-table-column prop="location" label="设备位置"></el-table-column>
      <el-table-column prop="parent_tag_num" label="父资产标签号"></el-table-column>
      <el-table-column prop="parent_name" label="父资产名称"></el-table-column>
      <el-table-column prop="value" label="基本当前成本 "></el-table-column>
      <el-table-column prop="start_time" label="启用日期">
        <template slot-scope="scope">
          {{scope.row.start_time | moment}}
        </template>
      </el-table-column>
      <el-table-column prop="person" label="责任人姓名"></el-table-column>
      <el-table-column prop="deparment" label="部门 "></el-table-column>
      <el-table-column width="100" label="操作">
        <template slot-scope="scope">
          <el-button @click="seeDetail(scope.row)" type="primary" size="small">查看</el-button>
        </template>
      </el-table-column>
    </template>
  </datagrid>
  <detail 
    ref="detail"
    :visible="visible"
    :imgs="imgs"
    @closeDialog="closeDialog">
  </detail>

</div>
</template>

<script>
import datagrid from '@/components/common/datagrid.vue'
import detail from '@/components/asset/detail.vue'
import api from '@/api'
import moment from 'moment'
export default {
  computed: {
  },
  components: {
    datagrid,
    detail
  },
  mounted () {
    this.handleEnter()
  },
  data () {
    return {
      allAssets: [],
      keystr: '',
      visible: false,
      searchForm: {
        name: '',
        tag_num: '',
        parent_name: '',
        asset_num: '',
        deparment: '',
        person: '',
        minvalue: '',
        maxvalue: '',
        start_time: []
      },
      allPersons: [],
      isFuzzy: false,
      imgs: {}
    }
  },
  methods: {
    handleEnter () {
      api.searchAssetList(
        {
          keystr: this.keystr,
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
    handleSearch (isSearch) {
      if (!this.isFuzzy || isSearch) {
        let _params = Object.assign({}, this.searchForm)
        if (this.searchForm.start_time[0]) {
          _params.minDate = moment(this.searchForm.start_time[0].getTime()).format('YYYY-MM-DD')
          _params.maxDate = moment(this.searchForm.start_time[1].getTime()).format('YYYY-MM-DD')
        }
        _params.page = this.$refs.datagrid.page.currentPage
        _params.pagesize = this.$refs.datagrid.page.pageSize
        api.fetchAssetList(_params).then(data => {
          this.allAssets = data.data
          this.$refs.datagrid.page.total = data.count
          this.$refs.datagrid.table.loading = false
          this.isFuzzy = false
        })
      } else {
        this.handleEnter()
      }
    },
    seeDetail (row) {
      this.visible = true
      this.$refs.detail.asset = row
      let params = {
        asset_id: row.asset_id,
        asset_num: row.asset_num,
        token: window.sessionStorage.getItem('token')
      }
      api.getAssetImg(params).then(data => {
        console.log(data)
        this.imgs = data
      })
    },
    closeDialog () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.asset-search{
  .datagrid__action {
    text-align: right;
    .el-input{
      width: 400px;
    }
  }
}
</style>
