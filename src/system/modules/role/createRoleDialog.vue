<template>
  <el-dialog
      title="创建角色"
        :visible="dialogVisible"
        :showClose="false"
        class="sys createRoleDailog"
        size="tiny">
    <el-row>
      <el-form :model="roleform" label-width="160px" ref="roleForm">
        <el-form-item label="角色英文代码：" prop="RoleID" required>
          <el-input v-model="roleform.RoleID" auto-complete="off" placeholder="【角色英文代码】"></el-input>
        </el-form-item>
        <el-form-item label="角色汉语名称：" prop="RoleName" required>
          <el-input v-model="roleform.RoleName" auto-complete="off" placeholder="【角色汉语名称】"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="Detail" >
          <el-input v-model="roleform.Detail" auto-complete="off"  placeholder="【描述】">
          </el-input>
        </el-form-item>
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
      roleform: {},
      enabledOptions: [],
      enabled: null,
      categoryOptions: [],
      category: null,
      description: null,
      name: null
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
      let params = this.roleform
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          this.$request.post(`/sys/index/putSysRole`, params).then(res => {
            let data = res.data
            if (data.ID === '0') {
              this.$message(`${data.msg}`)
            } else {
              this.$message('建立成功')
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