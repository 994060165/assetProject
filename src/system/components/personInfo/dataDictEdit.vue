<template>
  <div class="hello">
    <el-dialog :title="tableTitle" :visible="formVisible" :close-on-click-modal="false" size="large" :show-close='false'>
      <el-row>
          <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
            <el-col :span="12">
              <el-form-item label="字典代码" prop="dictCode" required>
                <el-input v-model="form.dictCode" auto-complete="off" :disabled="formDisabled || formWatchDisabled" placeholder="【必填】"></el-input>
              </el-form-item>
              <el-form-item label="字典名称" prop="optionName" required>
                <el-input v-model="form.optionName" auto-complete="off" placeholder="【必填】" :disabled="formWatchDisabled"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" auto-complete="off" :disabled="formWatchDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典值" prop="optionValue" >
                <el-input v-model="form.optionValue" auto-complete="off" placeholder="【必填】"  :disabled="formDisabled || formWatchDisabled"></el-input>
              </el-form-item>
              <el-form-item label="模块" prop="project">
                <el-select v-model="editModule" placeholder="模块选择"  :disabled="formDisabled || formWatchDisabled" @change="handleModuleChange">
                  <el-option
                    v-for="item in selectOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序" prop="orderNo" :rules="[{ type: 'number', message: '排序必须为数字'}]">
                <el-input type="number" v-model.number="form.orderNo" auto-complete="off"  :disabled="formWatchDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addCancel">取消</el-button>
        <el-button type="primary" @click.native="sysAddSubmit" v-if="tableType === 'sysAdd'" :loading="formLoading">新建</el-button>
        <el-button type="primary" @click.native="sysEditSubmit" v-if="tableType === 'sysEdit'" :loading="formLoading">编辑</el-button>
        <el-button type="primary" @click.native="classAddSubmit" v-if="tableType === 'classAdd'" :loading="formLoading">新建</el-button>
        <el-button type="primary" @click.native="classEditSubmit" v-if="tableType === 'classEdit'" :loading="formLoading">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { Button } from 'element-ui'
import { ProjectsAPI, LocalEntriesAPI, GlobalEntriesAPI } from '../../../../../../service/Dictionary'
Vue.use(Button)
export default {
  props: {
    formVisible: {
      type: Boolean,
      'default' () {
        return {}
      }
    },
    formDisabled: {
      type: Boolean,
      'default' () {
        return {}
      }
    },
    formWatchDisabled: {
      type: Boolean,
      'default' () {
        return {}
      }
    },
    form: {
      type: Object,
      'default' () {
        return {}
      }
    },
    tableTitle: {
      type: String,
      'default' () {
        return {}
      }
    },
    tableType: {
      type: String,
      'default' () {
        return {}
      }
    },
    editModule: {
      type: String,
      'default' () {
        return {}
      }
    }
  },
  data () {
    return {
      formLoading: false,
      formRules: {
        dictCode: [
          { required: true, message: '请您完善此项', trigger: 'change' }
        ],
        optionValue: [
          { required: true, message: '请您完善此项', trigger: 'change' }
        ],
        optionName: [
          { required: true, message: '请您完善此项', trigger: 'change' }
        ]
      },
      selectOptions: [],
      dictionary: new LocalEntriesAPI(),
      globalDictionary: new GlobalEntriesAPI(),
      projectApi: new ProjectsAPI()
    }
  },
  mounted () {
    let dialog = document.getElementsByClassName('el-dialog--large')
    dialog[0].style.width = '70%'
    this.projectApi.list().then(data => {
      data = data.concat([{code: '', name: ''}])
      this.selectOptions = data
    })
  },
  methods: {
    // 系统管理员新建数据字典
    sysAddSubmit () {
      this.form.project = this.editModule
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.formLoading = true
            this.$nextTick(() => {
              this.globalDictionary.create(this.form).then(res => {
                this.afterSub(res)
              })
            })
          })
        }
      })
    },
    sysEditSubmit () {
      this.form.project = this.editModule
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.formLoading = true
            this.$nextTick(() => {
              this.globalDictionary.update(this.form).then(res => {
                this.afterSub(res)
              })
            })
          })
        }
      })
    },
    // 提交之后处理的函数
    afterSub (res) {
      if (res.status === 200) {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.formLoading = false
        this.$refs['form'].resetFields()
        this.getDictList()
      } else {
        this.$message({
          message: '提交失败',
          type: 'error'
        })
        this.formLoading = false
      }
    },
    // 所级管理员添加
    classAddSubmit () {
      this.form.project = this.editModule
      this.form.sourceId = this.form.id
      delete this.form.id
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.formLoading = true
            this.$nextTick(() => {
              this.dictionary.create(this.form).then(res => {
                this.afterSub(res)
              })
            })
          })
        }
      })
    },
    // 所级管理员编辑
    classEditSubmit () {
      this.form.project = this.editModule
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.formLoading = true
            this.$nextTick(() => {
              this.dictionary.update(this.form).then(res => {
                this.afterSub(res)
              })
            })
          })
        }
      })
    },
    handleModuleChange (value) {
      this.editModule = value
    },
    addCancel () {
      this.formLoading = false
      this.$nextTick(() => {
        this.$emit('addCancel')
      })
    },
    getDictList () {
      this.$nextTick(() => {
        this.$emit('getDictList')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
