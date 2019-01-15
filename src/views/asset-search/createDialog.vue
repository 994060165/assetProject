<template>
  <el-dialog
      title="编辑资产信息"
        :visible="dialogVisible"
        :showClose="false"
        class="sys createRoleDailog"
        size="tiny">
    <el-row>
      <el-form :model="assetData" label-width="160px" ref="roleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资产位置：" prop="location" >
              <el-input v-model="assetData.location" auto-complete="off" placeholder="【资产位置】"></el-input>
            </el-form-item>
            <!--
              
            <el-form-item label="资产名称：" prop="name">
              <el-input v-model="assetData.name" auto-complete="off" placeholder="【角色英文代码】"></el-input>
            </el-form-item><el-form-item label="资产标签号：" prop="tag_num" >
              <el-input v-model="assetData.tag_num" auto-complete="off" placeholder="【角色英文代码】"></el-input>
            </el-form-item>
            <el-form-item label="金额：" prop="value" >
              <el-input v-model="assetData.value" auto-complete="off" placeholder="【角色英文代码】"></el-input>
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <!--
              <el-form-item label="资产编码：" prop="asset_num" >
              <el-input v-model="assetData.asset_num" auto-complete="off" placeholder="【角色英文代码】"></el-input>
            </el-form-item>
            <el-form-item label="基本当前成本：" prop="value" >
              <el-input v-model="assetData.value" auto-complete="off" placeholder="【角色英文代码】"></el-input>
            </el-form-item>
            <el-form-item label="部门：" prop="deparment" >
              <el-input v-model="assetData.deparment" auto-complete="off" placeholder="【角色英文代码】"></el-input>
            </el-form-item>-->
            <el-form-item label="领用人：" prop="person" >
              <el-input v-model="assetData.person" auto-complete="off" placeholder="【领用人】"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
        return false
      }
    },
    assetData: {
      type: Object,
      default: {}
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
      this.$emit('cancel')
    },
    // 确定
    handleConfirm () {
      let params =
        {
          asset_id: this.assetData.asset_id,
          person: this.assetData.person,
          location: this.assetData.location
        }
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          this.$emit('changeAsset', params)
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