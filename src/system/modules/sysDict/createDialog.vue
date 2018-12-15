<template>
  <el-dialog
      title="创建字典"
        :visible="dialogVisible"
        :showClose="false"
        @open="init"
        class="sys createRoleDailog"
        size="tiny">
    <el-row>
      <el-form :model="dictForm" label-width="120px" ref="dictForm" :rules="formRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="字典代码：" prop="DataID">
              <el-input v-model="dictForm.DataID" auto-complete="off" placeholder="【字典代码】"></el-input>
            </el-form-item>
            <el-form-item label="字典值-int型：" prop="DataValueInt" >
              <el-input v-model="dictForm.DataValueInt" auto-complete="off"  placeholder="【字典值-int型】">
              </el-input>
            </el-form-item>
            <el-form-item label="是否启用：">
              <el-switch
              v-model="Tag">

              </el-switch>
            </el-form-item>
            <el-form-item label="字典分组标识：" prop="GroupName" >
              <el-input v-model="dictForm.GroupName" auto-complete="off"  placeholder="【字典分组标识】">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典值：" prop="DataValue" >
              <el-input v-model="dictForm.DataValue" auto-complete="off"  placeholder="【字典值】">
              </el-input>
            </el-form-item>
            <el-form-item label="字典名称：" prop="DataName" >
              <el-input v-model="dictForm.DataName" auto-complete="off"  placeholder="【字典名称】">
              </el-input>
            </el-form-item>
            <el-form-item label="字典说明：" prop="DataMemo">
              <el-input v-model="dictForm.DataMemo" auto-complete="off" placeholder="【字典说明】"></el-input>
            </el-form-item>

            <el-form-item label="字典分类：" prop="DataType">
              <el-input v-model="dictForm.DataType" auto-complete="off" placeholder="【字典分类】"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-table-column
          prop="FID"
          label="父ID">
        </el-table-column> -->
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      'default' () {
        return {}
      }
    }
  },
  data () {
    return {
      formRules: {
        DataID: [
          { required: true, message: '字典代码不能为空', trigger: 'blur' }
        ]
      },
      dictForm: {},
      Tag: true
    }
  },
  mounted () {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 取消
    handleCancel () {
      this.$emit('createCancel')
    },
    // 确定
    handleConfirm () {
      let params = this.dictForm
      if (this.Tag) {
        params.Tag = '1'
      } else {
        params.Tag = '0'
      }
      this.$refs['dictForm'].validate((valid) => {
        if (valid) {
          this.$request.post(`/sys/index/putSysData`, params).then(res => {
            let data = res.data
            if (data.ID === '0') {
              this.$message(`${data.msg}`)
            } else {
              this.$message({
                message: '建立成功',
                type: 'success'
              })
              this.$emit('createSuccess')
            }
          })
        }
      })
    }
  },
  created () {
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
  .option {
    width: 100%;
  }
  .required {
    color: red;
  }
  .leftcol {
    text-align: right;
  }
  .rightcol {
    text-align: left;
  }
</style>