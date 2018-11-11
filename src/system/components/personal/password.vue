<template>
  <div id="right">
    <div class="righttop"><h4>修改密码</h4></div>
    <div class="rightbottom">
      <div class="rightbottom_box">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
          <el-form-item label="密码" prop="pass" class="rightbottom_input">
            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" class="rightbottom_input">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { updatePsw } from '../../service/home'
  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm2: {
          pass: '',
          checkPass: ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
    },
    computed: {
    },
    watch: {
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updatePsw(this.ruleForm2).then(data => {
              console.log((this.ruleForm2))
              this.$message('成功').then(action => {
              })
            })
          } else {
            console.log('提交失败')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    created () {
    },
    components: {
    }
  }
</script>
<style lang="scss" scoped>
  #right {
    height: 780px;
    .righttop {
      width: 100%;
      height: 44px;
      border-bottom: 1px solid #eaeaea;
      h4 {
        font-size: 16px;
        line-height: 34px;
        margin-left: 20px;
        font-weight: 600;
        color: #333;
      }
    }
    .rightbottom {
      overflow-y: auto;
      .rightbottom_box {
        margin-top: 20px;
        .rightbottom_input {
          width: 400px;
        }
        .rightbottom_phone {
          left: -40px;
          top: -50px;
        }
      }
    }
  }
</style>
