<template>
  <div class="registerForm1">
    <el-dialog title="重置密码" :visible="formVisible" :close-on-click-modal="false" :show-close='false'>
      <el-row>
        <el-row>
         <el-form :model="form" label-width="160px" ref="form" :rules="formRules">
          <el-col :span="12">
            <el-form-item label="用户ID：" prop="UserID">
              <div>{{form.UserID}}</div>
            </el-form-item>
            <el-form-item label="手机号：" prop="UserMobile" >
              <div>{{form.UserMobile}}</div>
            </el-form-item>
            <el-form-item label="密码：" prop="Password" required >
              <el-input v-model="form.Password" :type="psType" auto-complete="off">
              </el-input>
              <i class="el-icon-view" @mousedown="psType = 'text'" @mouseup="psType = 'password'"></i>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="personFormRight">
            <el-form-item label="用户名：" prop="UserName">
              <div>{{form.UserName}}</div>
            </el-form-item>
            <el-form-item label="Email：" prop="UserEmail" >
              <div>{{form.UserEmail}}</div>
            </el-form-item>
            <el-form-item label="确认密码：" prop="repassword">
              <el-input v-model="form.repassword" type="password" auto-complete="off">
              </el-input>
            </el-form-item>
          </el-col>
         </el-form>
        </el-row>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addCancel">取消</el-button>
        <el-button type="primary" @click.native="sysAddSubmit" :loading="formLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { register } from '../../service/register.js'
export default {
  props: {
    formVisible: {
      type: Boolean,
      'default' () {
        return false
      }
    },
    form: {
      type: Object,
      'default' () {
        return {
        }
      }
    }
  },
  data () {
    return {
      formLoading: false,
      psType: 'password',
      formRules: {
        Password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ],
        repassword: [
          { required: true, message: '确认密码不能为空', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    // 提交注册信息
    sysAddSubmit () {
      this.formLoading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.formLoading = false
            let params = Object.assign({}, this.form)
            this.$request.post('/sys/index/ResetPassword', params).then(res => {
              this.afterSub(res)
            }, () => {
              this.formLoading = false
            })
          }, () => {
            this.formLoading = false
          })
        }
      })
    },
    // 提交之后处理的函数
    afterSub (res) {
      let data = res.data
      if (data.ID !== '-1' && data.ID !== '0') {
        this.$message({
          message: '重置成功',
          type: 'success'
        })
        this.formLoading = false
        this.$refs['form'].resetFields()
        this.addCancel()
      } else {
        this.$message({
          message: `非常抱歉，重置失败！${data.msg}`,
          type: 'error'
        })
        this.formLoading = false
      }
    },
    addCancel () {
      this.formLoading = false
      this.$refs['form'].resetFields()
      this.$nextTick(() => {
        this.$emit('addCancel')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
<style lang="scss">
.registerForm1 {
  .el-cascader {
    width: 100%;
  }
  .el-select {
    width: 90%;
    .el-input {
      width: 100%;
    }
  }
  .el-input {
    width: 90%;
  }
}
</style>
