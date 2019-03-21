<template>
  <div class="registerForm1">
    <el-dialog :title="tableTitle" :visible="formVisible" :close-on-click-modal="false" :show-close='false'>
      <el-row>
        <el-row>
         <el-form :model="form" label-width="160px" ref="form" :rules="formRules">
          <el-col :span="12">
            <el-form-item label="用户ID：" prop="UserID">
              <div v-if="editUser">{{form.UserID}}</div>
              <el-input v-else v-model="form.UserID" auto-complete="off" placeholder="【请输入5-25位的数字英文组合！】"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="UserMobile" >
              <el-input v-model="form.UserMobile" auto-complete="off" placeholder="【手机号】"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="Password" required  v-if="!editUser">
              <el-input v-model="form.Password" :type="psType" auto-complete="off">
              </el-input>
              <i class="el-icon-view" @mousedown="psType = 'text'" @mouseup="psType = 'password'"></i>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="personFormRight">
            <!-- <el-form-item label="性别：" prop="gender" required>
              <el-radio class="radio" v-model="form.gender" label="M" >男</el-radio>
              <el-radio class="radio" v-model="form.gender" label="W">女</el-radio>
            </el-form-item> -->
            <el-form-item label="用户名：" prop="UserName">
              <el-input v-model="form.UserName" auto-complete="off" placeholder="【用户名】"></el-input>
            </el-form-item>
            <el-form-item label="Email：" prop="UserEmail" >
              <el-input v-model="form.UserEmail" auto-complete="off" placeholder="【可用于找回密码，请您谨慎填写】"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="repassword" v-if="!editUser">
              <el-input v-model="form.repassword" type="password" auto-complete="off">
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="机构：">
                <el-select v-model="form.dept" placeholder="选择一个注册机构">
                <el-option
                  v-for="item in deptOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
          </el-col>
         </el-form>
        </el-row>
          <!-- <el-row style="padding: 20px;">
            如果没有您想要加入的机构，请您新建一个机构！<el-button type="primary" @click.native="addDept">{{buttonTitle}}</el-button>
          </el-row> -->
          <!-- <el-form :model="form2" label-width="160px" ref="form2" :rules="formRules2" v-if="deptShow">
            <el-col :span="12">
              <el-form-item label="机构名称：" prop="deptname">
                <el-input v-model="form2.deptname" auto-complete="off" placeholder="【机构名称】"></el-input>
              </el-form-item>
              <el-form-item label="机构地址：" prop="adress" >
                <el-input v-model="form2.adress" auto-complete="off" placeholder="【机构地址】"></el-input>
              </el-form-item>
              <el-form-item label="机构说明：" prop="passWord" required>
                <el-input v-model="form2.shuoming"  auto-complete="off" placeholder="【机构说明】">
                </el-input>
              </el-form-item>
              <el-form-item label="机构管理员密码：" prop="passWord" >
                <el-input v-model="form2.passWord" auto-complete="off"  placeholder="【机构管理员密码】">
                </el-input>
              </el-form-item>
              <el-form-item label="再次确认密码：" prop="passWord2" >
                <el-input v-model="form2.passWord2" auto-complete="off" placeholder="【再次确认密码】"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机构联系人：" prop="userName">
                <el-input v-model="form2.userName" auto-complete="off" placeholder="【机构联系人】"></el-input>
              </el-form-item>
              <el-form-item label="机构联系电话：">
                <el-input v-model="form2.tel" auto-complete="off"  placeholder="【机构联系电话】">
                </el-input>
              </el-form-item>
              <el-form-item label="机构管理员账号：" prop="zhanghao" >
                <el-input v-model="form2.zhanghao" auto-complete="off" placeholder="【机构管理员账号】"></el-input>
              </el-form-item>
              <el-form-item label="机构联系邮箱：" prop="email" >
                <el-input v-model="form2.email" auto-complete="off" placeholder="【机构联系邮箱】">
                </el-input>
              </el-form-item>
              <el-form-item label="验证码：" prop="yzm" >
                <el-input v-model="form2.yzm" auto-complete="off" placeholder="【验证码】"></el-input>
              </el-form-item>
            </el-col>
          </el-form> -->
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
    },
    tableTitle: {
      type: String,
      'default' () {
        return ''
      }
    },
    editUser: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formLoading: false,
      psType: 'password',
      deptShow: false,
      buttonTitle: '新建机构',
      deptOptions: [
        {
          label: '北语',
          value: 'beiyu'
        },
        {
          label: '人大',
          value: 'renda'
        },
        {
          label: '浙大',
          value: 'zheda'
        },
        {
          label: '其他',
          value: 'qita'
        }
      ],
      formRules2: {
        deptname: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' }
        ],
        Password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '机构联系人不能为空', trigger: 'blur' }
        ],
        zhanghao: [
          { required: true, message: '机构管理员账号不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '机构联系邮箱不能为空', trigger: 'blur' }
        ],
        mobile: [
          { validator: (rule, value, callback) => {
            if (/^[1][3,4,5,7,8][0-9]{9}$/.test(value) === false) {
              callback(new Error('请您输入正确的手机号！'))
            } else {
              callback()
            }
          },
            trigger: 'change',
            required: true
          }
        ],
        mail: [
          { validator: (rule, value, callback) => {
            if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) === false) {
              callback(new Error('请您输入正确的邮箱！'))
            } else {
              callback()
            }
          },
            trigger: 'change',
            required: true
          }
        ]
      },
      form2: {},
      formRules: {
        UserID: [
          { validator: (rule, value, callback) => {
            if (/^[A-Za-z][_0-9a-zA-Z]{4,25}$/.test(value) === false) {
              callback(new Error('请输入5~25位以字母开头，字母数字和下划线组成的ID！'))
            } else {
              callback()
            }
          },
            trigger: 'blur',
            required: true
          }
        ],
        UserName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        UserMobile: [
          { validator: (rule, value, callback) => {
            if (/^[1][3,4,5,7,8][0-9]{9}$/.test(value) === false) {
              callback(new Error('请您输入正确的手机号！'))
            } else {
              callback()
            }
          },
            trigger: 'change',
            required: true
          }
        ],
        Password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ],
        repassword: [
          { required: true, message: '确认密码不能为空', trigger: 'change' }
        ],
        UserEmail: [
          { validator: (rule, value, callback) => {
            if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) === false) {
              callback(new Error('请您输入正确的邮箱！'))
            } else {
              callback()
            }
          },
            trigger: 'change',
            required: true
          }
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
            // params.Password = this.$md5(params.Password)
            // params.repassword = this.$md5(params.repassword)
            if (this.editUser) {
              this.changeUser(params)
            } else {
              this.regUser(params)
            }
          }, () => {
            this.formLoading = false
          })
        }
      })
    },
    regUser (form) {
      this.$request.post('/sys/index/regUser', form).then(res => {
        this.afterSub(res)
      })
    },
    changeUser (form) {
      this.$request.post('/sys/index/putUser', form).then(res => {
        this.afterSub(res)
      })
    },
    // 提交之后处理的函数
    afterSub (res) {
      let data = res.data
      if (data.ID !== '-1') {
        this.$message({
          message: '注册成功',
          type: 'success'
        })
        this.formLoading = false
        this.$refs['form'].resetFields()
        this.addCancel()
      } else {
        this.$message({
          message: `非常抱歉，注册失败！${data.msg}`,
          type: 'error'
        })
      }
    },
    addCancel () {
      this.formLoading = false
      this.$refs['form'].resetFields()
      this.$nextTick(() => {
        this.$emit('addCancel')
      })
    },
    addDept () {
      console.log('添加机构')
      this.deptShow = !this.deptShow
      this.buttonTitle = this.deptShow ? '取消' : '新建机构'
    },
    upload () {
      this.$nextTick(() => {
        this.$emit('upload')
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
