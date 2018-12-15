<template>
<div class="asset-check__add">
  <el-dialog title="新增计划" class="model" :visible="insertVisible" :before-close="handleClose" :modal="true" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
    <el-form :model="submitForm" :rules="submitRule" ref="submitForm" label-width="100px">
      
      <el-form-item label="计划名称" prop="plan_name">
         <el-input v-model="submitForm.plan_name"></el-input>
       </el-form-item>
      <el-form-item label="计划说明" prop="plan_memo">
        <el-input v-model="submitForm.plan_memo"></el-input>
      </el-form-item>
      <!-- <el-form-item label="任务执行人" prop="executor">
        <el-select filterable v-model="submitForm.executor" placeholder="请选择任务执行人">
          <el-option v-for="(item, index) in allPersons" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="截止日期" required>
        <el-form-item prop="deadline">
          <el-date-picker type="date" placeholder="请选择截止日期" v-model="submitForm.deadline" ></el-date-picker>
        </el-form-item>
      </el-form-item>
      <!-- <el-form-item>
        <el-button :loading="loading" type="primary" @click="handleSubmit()">提交任务</el-button>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button  @click="handleClose">关 闭</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit()">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import moment from 'moment'
import datagrid from '@/components/common/datagrid.vue'
import api from '@/api'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'asset-check__add',
  props: {
    insertVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'allDeparments',
      'allPersons'
    ])
  },
  components: {
    datagrid
  },
  data () {
    return {
      loading: false,
      alert: {
        text: '',
        visible: false,
        type: ''
      },
      isFuzzy: false,
      allAssets: [],
      keyword: '',
      searchForm: {
        deparment: '',
        person: '',
        minvalue: 0,
        maxvalue: 0,
        date: []
      },
      submitForm: {
        name: '',
        executor: '',
        deadlineDate: '',
        deadline: '',
        asset_id: []
      },
      submitRule: {
        plan_name: [
          {
            required: true,
            message: '请输入计划名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 30,
            message: '长度在 3 到 30 个字符',
            trigger: 'blur'
          }
        ],
        plan_memo: [
          {
            required: true,
            message: '请填写计划说明',
            trigger: 'change'
          }
        ],
        deadlineDate: [{
          type: 'date',
          required: true,
          message: '请选择截止日期',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('refresh')
      this.alert.visible = false
      this.$refs.submitForm.resetFields()
      this.allAssets = []
    },
    handleEnter () {
      api.searchAssetList(
        this.keyword, this.$refs.datagrid.page.currentPage, 200
      ).then(response => {
        this.allAssets = response.data['search result']
        this.$refs.datagrid.table.loading = false
        this.$refs.datagrid.page.total = response.data.totalcount
        this.isFuzzy = true
      })
    },
    handleSelectionChange (val) {
      this.submitForm.asset_id = []
      val.forEach((item, index) => {
        this.submitForm.asset_id.push(item.asset_id)
      })
    },
    handleSearch (isSearch) {
      if (!this.isFuzzy || isSearch) {
        var _params = {}
        this.searchForm.deparment && (_params.deparment = this.searchForm.deparment)
        this.searchForm.person && (_params.person = this.searchForm.person)
        _params.minvalue = this.searchForm.minvalue
        this.searchForm.maxvalue && (_params.maxvalue = this.searchForm.maxvalue)
        if (this.searchForm.date[0]) {
          _params.minDate = this.searchForm.date[0].getTime()
          _params.maxDate = this.searchForm.date[1].getTime()
        }
        api.fetchAssetList(
          _params, this.$refs.datagrid.page.currentPage, 200
        ).then(response => {
          this.allAssets = response.data.assets
          this.$refs.datagrid.page.total = response.data.totalcount
          this.$refs.datagrid.table.loading = false
          this.isFuzzy = false
        })
      } else {
        this.handleEnter()
      }
    },
    handleSubmit (formName) {
      let _deadlineDate = moment(this.submitForm.deadline).format('YYYY-MM-DD')
      this.$refs.submitForm.validate(valid => {
        if (valid) {
          this.loading = true
          let params = {
            plan_memo: this.submitForm.plan_memo,
            plan_name: this.submitForm.plan_name,
            deadline: _deadlineDate,
            create_person: JSON.parse(sessionStorage.getItem('user')).UserID,
            token: window.sessionStorage.getItem('token')
          }
          api.postCheck(params).then(data => {
            this.loading = false
            if (data.ID === '-1') {
              this.$message({
                type: 'error',
                message: `${data.msg}`
              })
              // this.handleClose()
            } else {
              this.$message({
                type: 'success',
                message: '新建成功！'
              })
              this.handleClose()
            }
          }, err => {
            console.log(err)
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/base.scss';

.asset-check__add {
  .datagrid__action {
    text-align: right;
    .el-input {
      width: 400px;
    }
  }
  .el-alert{
    margin: $global-gap 0 0;
    + .el-form{
      margin-top: $global-gap;
    }
  }
  .el-form-item.is-required .el-input{
    width: 200px;
  }
  .datagrid__action p {
    position: absolute;
    bottom: $global-gap;
    left: 0;
  }
}
.el-dialog__header{background: #f6f6f6;border-bottom: 1px solid #ddd;}
.el-dialog__footer{border-top:1px solid #ddd;}
.asset-check__add .model .el-form{width:380px;margin: 0 auto;}
</style>
