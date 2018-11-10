<template>
     <!--修改弹框-->
  <div class="modifydialog_box">
    <el-dialog :title="title" :visible.sync="localVisible">
      <el-row>
        <el-form :model="userInfoForm" ref="userInfoForm" label-width="100px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="兼职/专职：" prop="property" >
                <el-select  v-model="userInfoForm.property" placeholder="请选择">
                  <el-option v-for="item in workPropertyTypes" :key="item.optionValue" :value="item.optionValue" :label="item.optionName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序：" prop="orderNumber" >
                <el-input type="number" v-model="userInfoForm.orderNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row style="padding: 40px 0 10px 35%;">
        <!-- 在多租户下保存存在问题 -->
        <el-button type="primary" @click="submitUserForm('userInfoForm')" class="stylebtn2">保存</el-button>
        <el-button @click="resetForm('userInfoForm')" class="stylebtn2">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import {LocalDeptAPI} from '../../service/LocalDeptService'
  export default {
    props: {
      userInfo: {
        type: Object,
        'default' () {
          return {}
        }
      },
      deptId: {
        type: String,
        'default' () {
          return ''
        }
      },
      visible: {
        type: Boolean,
        'default' () {
          return {}
        }
      },
      workPropertyTypes: {
        type: Array,
        'default' () {
          return []
        }
      }
    },
    data () {
      return {
        userInfoForm: {
          property: '',
          id: '',
          orderNumber: 0
        },
        localVisible: false,
        localDeptId: '',
        title: '个人信息'
      }
    },
    methods: {
      // 修改人员信息
      submitUserForm (res) {
        this.$refs[res].validate((vaild) => {
          if (vaild) {
            let userInfo = {
              userId: this.userInfoForm.id,
              property: this.userInfoForm.property,
              'rank': this.userInfoForm.orderNumber
            }
            LocalDeptAPI.updateUser(this.localDeptId, userInfo).then(res => {
              this.$message('编辑成功！')
              this.$emit('success', userInfo)
            }, () => {
              this.$message('编辑失败！')
            })
          }
        })
      },
      //      取消
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.$emit('close')
      }
    }, // methods end
    mounted: function () {
      this.userInfoForm.id = this.userInfo.id
      this.userInfoForm.property = this.userInfo.property
      this.userInfoForm.orderNumber = this.userInfo.orderNumber
      this.title = `个人信息(${this.userInfo.userName})`
    },
    computed: {
    },
    watch: {
      userInfo () {
        // this.userInfoForm = this.userInfo
        this.userInfoForm.id = this.userInfo.id
        this.userInfoForm.property = this.userInfo.property
        this.userInfoForm.orderNumber = this.userInfo.orderNumber
        this.title = `个人信息(${this.userInfo.userName})`
      },
      visible () {
        this.localVisible = this.visible
      },
      deptId () {
        this.localDeptId = this.deptId
      }
    },
    created () {
    }
  }
</script>
<style lang="scss" scoped>
  .modifydialog_box{
      margin: 20px auto;
      .el-dialog--small {
        width: 42%;
      }
      .el-form-item{
        float: left;
        width: 300px;
        margin-right: 50px;
        margin-top: 20px;
      }
      .stylebtn{
        display: inline-block;
        width: 100px;
        height: 40px;
        margin-bottom: 20px;
        margin-left: 200px;
      }
      .stylebtn2{
        display: inline-block;
        width: 100px;
        height: 40px;
      }
    }
</style>