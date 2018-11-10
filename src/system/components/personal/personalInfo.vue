<template>
  <div id="right">
    <div class="righttop"><h4>个人信息</h4></div>
    <div class="rightbottom">
      <div class="rightbottom_box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="姓名" prop="name" class="rightbottom_input">
            <el-input class="rightbottom_input" v-model="ruleForm.userName" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="resource" class="rightbottom_input">
            <el-radio class="radio" v-model="radio" label="M" disabled>男</el-radio>
            <el-radio class="radio" v-model="radio" label="2" disabled="disabled">女</el-radio>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone" class="rightbottom_input">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
          <el-switch v-model="ruleForm.phoneEnabled" on-color="#13ce66" off-color="#ff4949" class="rightbottom_phone"></el-switch>
          <el-form-item label="工作邮箱" prop="email" class="rightbottom_input">
            <el-input class="rightbottom_input" v-model="ruleForm.emailWork"></el-input>
          </el-form-item>
          <el-form-item label="办公地址" prop="address" class="rightbottom_input">
            <el-input class="rightbottom_input" v-model="ruleForm.officeAddr"></el-input>
          </el-form-item>
          <el-form-item label="座机号码" prop="Landline" class="rightbottom_input">
            <el-input class="rightbottom_input" v-model="ruleForm.officeTel"></el-input>
          </el-form-item>
          <el-form-item label="部门" class="rightbottom_input">
            <el-input class="rightbottom_input" v-model="ruleForm.corpDeptName" disabled></el-input>
          </el-form-item>
          <el-form-item label="岗位" class="rightbottom_input">
            <el-input class="rightbottom_input" v-model="ruleForm.jobsId" disabled></el-input>
          </el-form-item>

          <el-form-item style="margin-left: 0">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { queryStaffInfo, updateStaff } from '../../service/home'
  export default {
    data () {
      return {
        radio: 'M',
        ruleForm: {
          phoneEnabled: '',
          userName: '',
          mobile: '',
          emailWork: '',
          officeAddr: '',
          officeTel: ''
        },
        rules: {
          userName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          emailWork: [
            { required: true, message: '请输入邮箱', trigger: 'blur' }
          ],
          officeAddr: [
            { required: true, message: '请输地址', trigger: 'blur' }
          ],
          officeTel: [
            { required: true, message: '请输入座机号码', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.queryInfo()
    },
    computed: {
      pokerHistory () {
        return this.ruleForm.emailWork
      },
      telNumber () {
        return this.ruleForm.mobile
      }
    },
    watch: {
      pokerHistory (newValue, oldValue) {
        this.emailWorkTest(newValue)
      },
      telNumber (newValue, oldValue) {
        this.mobileTest(newValue)
        console.log(newValue)
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let staff = this.ruleForm
            updateStaff(staff).then(data => {
              this.$message('成功').then(action => {
                console.log(staff)
              })
            })
          } else {
            console.log('保存失败!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      queryInfo () {
        queryStaffInfo().then(data => {
          this.ruleForm = data
        })
      },
      mobileTest (mobile) {
        let telTest = /^[1][34578][0-9]{9}$/
        if (telTest.test(mobile)) {
          this.teltest = true
        } else if (!telTest.test(mobile)) {
          this.teltest = false
        }
      },
      emailWorkTest (email) {
        let pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        if (pattern.test(email)) {
          this.emailtest = true
        } else {
          this.emailtest = false
        }
      },
      toolchange () {

      }
    }
  }
</script>

<style lang="scss" scoped>
  #right{
    height: 780px;
    .righttop{
      width: 100%;
      height: 44px;
      border-bottom: 1px solid #eaeaea;
      h4{
        font-size: 16px;
        line-height: 34px;
        margin-left: 20px;
        font-weight: 600;
        color: #333;
      }
    }
    .rightbottom{
      overflow-y: auto;
      .rightbottom_box{
        margin-top: 20px;
        .rightbottom_input{
          width: 300px;
        }
        .rightbottom_phone{
          left: -40px;
          top: -50px;
        }
      }
    }
  }

</style>
