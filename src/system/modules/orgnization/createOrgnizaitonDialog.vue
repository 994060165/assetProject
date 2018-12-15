<template>
        <!--新建弹框-->
    <el-dialog title="新增机构/单位" :visible="deptVisible" :show-close="true" :before-close="handleClose" @close="handleClose">
      <el-row>
        <el-form :model="orgForm" label-width="160px" ref="deptForm" :rules="departmentFormRules">
            <el-col :span="12">
              <el-form-item label="机构名称：" prop="OrgName">
                <el-input v-model="orgForm.OrgName" auto-complete="off" :disabled="addDeptDisabled" placeholder="【机构名称】"></el-input>
              </el-form-item>
              <!-- <el-form-item label="机构地址：" prop="adress" >
                <el-input v-model="orgForm.adress" auto-complete="off" placeholder="【机构地址】"></el-input>
              </el-form-item> -->
              <el-form-item label="机构说明：">
                <el-input v-model="orgForm.Detail"  auto-complete="off" :disabled="addDeptDisabled" placeholder="【机构说明】">
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="机构管理员密码：" prop="passWord" >
                <el-input v-model="orgForm.passWord" auto-complete="off"  placeholder="【机构管理员密码】">
                </el-input>
              </el-form-item> -->
              <!-- <el-form-item label="再次确认密码：" prop="passWord2" >
                <el-input v-model="orgForm.passWord2" auto-complete="off" placeholder="【再次确认密码】"></el-input>
              </el-form-item> -->
            </el-col>
            <el-col :span="12">
              <el-form-item label="机构代码：" prop="OrgID">
                <el-input v-model="orgForm.OrgID" :disabled="addDeptDisabled" auto-complete="off" placeholder="【机构说明】">
                </el-input>
              </el-form-item>
              <el-form-item label="是否启用：">
                <el-switch v-model="tag" :disabled="addDeptDisabled">
                </el-switch>
              </el-form-item>
              <!-- <el-form-item label="机构联系人：" prop="userName">
                <el-input v-model="orgForm.userName" auto-complete="off" placeholder="【机构联系人】"></el-input>
              </el-form-item>
              <el-form-item label="机构联系电话：">
                <el-input v-model="orgForm.tel" auto-complete="off"  placeholder="【机构联系电话】">
                </el-input>
              </el-form-item>
              <el-form-item label="机构管理员账号：" prop="zhanghao" >
                <el-input v-model="orgForm.zhanghao" auto-complete="off" placeholder="【机构管理员账号】"></el-input>
              </el-form-item>
              <el-form-item label="机构联系邮箱：" prop="email" >
                <el-input v-model="orgForm.email" auto-complete="off" placeholder="【机构联系邮箱】">
                </el-input>
              </el-form-item>
              <el-form-item label="验证码：" prop="yzm" >
                <el-input v-model="orgForm.yzm" auto-complete="off" placeholder="【验证码】"></el-input>
              </el-form-item> -->
            </el-col>
          </el-form>
      </el-row>
      <el-button type="primary" @click="saveDept" :disabled="orgForm.OrgName.length === 0 || addDeptDisabled">保存</el-button>
      <el-button type="" @click="handleClose">取消</el-button>
    </el-dialog>
</template>

<script>
  export default {
    props: {
      deptVisible: {
        type: Boolean,
        'default' () {
          return false
        }
      },
      deptTypes: {
        type: Array,
        'default' () {
          return []
        }
      },
      resCode: {
        type: String,
        'default' () {
          return ''
        }
      },
      parentId: {
        type: String,
        'default' () {
          return ''
        }
      },
      deptRank: {
        type: Array,
        'default' () {
          return []
        }
      },
      deptRankDict: {
        type: Array,
        'default' () {
          return []
        }
      }
    },
    data () {
      return {
        departmentFormRules: {
          OrgName: {
            required: true, message: '请输入名称', trigger: 'blur'
          },
          OrgID: {
            required: true, message: '请输入机构代码', trigger: 'blur'
          }
        },
        orgForm: {
          OrgName: ''
        },
        tag: true,
        addDeptDisabled: false
      }
    },
    methods: {
      handleClose () {
        this.$emit('close')
      },
      // 新增部门
      saveDept () {
        this.addDeptDisabled = true
        this.$refs['deptForm'].validate((valid) => {
          if (valid) {
            let params = this.orgForm
            if (this.tag) {
              params.tag = '1'
            } else {
              params.tag = '0'
            }
            this.$request.post('/sys/index/putSysOrg', params).then(res => {
              let data = res.data
              if (data.ID === '0') {
                this.addDeptDisabled = false
                this.$message('添加失败！')
              } else {
                this.$refs['deptForm'].resetFields()
                this.addDeptDisabled = false
                this.$message('添加成功！')
                this.$emit('created')
              }
            }, () => {
              this.addDeptDisabled = false
              this.$message('添加失败！')
              this.$emit('close')
            })
          }
        })
      }
    }, // methods end
    mounted: function () {
      this.addDeptDisabled = false
    },
    computed: {
    },
    watch: {
      dept () {
        this.orgForm = this.dept
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
