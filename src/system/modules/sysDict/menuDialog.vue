<template>
 <el-dialog
     v-loading="loading2"
    title="配置菜单"
    :visible="dialogVisible"
    :showClose="false"
    class="sys menuDialog">
    <el-row :gutter="24" width="100%">
      <el-col :span="12" style="border: 1px solid #eee;height: 400px; overflow-y: scroll;">
        <el-tree
          ref="menutree"
          class="menutree"
          :data="menuDatas"
          :props="props"
          :render-content="renderContent"
          node-key="id"
          :expand-on-click-node="true">
        </el-tree>
      </el-col>
      <el-col :span="12">
        <el-tag
          v-for="tag in tags"
          :key="tag.FunID"
          :closable="true"
           @close="handleTagClose(tag)"
           style="margin: 10px 0 0 10px;"
          :type="tag.type">
          {{tag.FunName}}
        </el-tag>
      </el-col>
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
      },
      roleId: {
        type: String,
        'default' () {
          return ''
        }
      }
    },
    data () {
      return {
        loading2: true,
        props: {
          id: 'InnerID',
          label: 'FunName',
          children: 'children'
        },
        menuDatas: [],
        tags: [],
        rawTags: {},
        rawLength: 0,
        menuData: [],
        expendIds: []
      }
    },
    mounted () {
      this.getMenusData()
    },
    computed: {
    },
    watch: {
    },
    created () {
    },
    methods: {
      // 获取菜单数据
      getMenusData () {
        this.$request.get(`/sys/index/gettree`).then(res => {
          let obj = res.data
          let data = []
          for (let item in obj) {
            data.push(obj[item])
          }
          let one = []
          let two = []
          let three = []
          for (let i = 0; i < data.length; i++) {
            if (data[i].MenuLevelID === '2') {
              three.push(data[i])
            } else if (data[i].MenuLevelID === '1') {
              two.push(data[i])
            } else if (data[i].MenuLevelID === '0') {
              one.push(data[i])
            }
          }
          for (let m = 0; m < one.length; m++) {
            one[m].children = []
            for (let n = 0; n < two.length; n++) {
              if (two[n].FatherID === one[m].FunID) {
                one[m].children.push(two[n])
              }
            }
          }
          for (let j = 0; j < two.length; j++) {
            two[j].children = []
            for (let k = 0; k < three.length; k++) {
              if (three[k].FatherID === two[j].FunID) {
                two[j].children.push(three[k])
              }
            }
          }
          this.menuDatas = one
          this.loading2 = false
          this.getRoleMenu()
        })
      },
      getRoleMenu () {
        let params = {
          RoleID: this.roleId
        }
        this.$request.post('/sys/index/getFuns', params).then(res => {
          if (res.data) {
            this.tags = res.data
          }
        })
      },
      // 取消
      handleCancel () {
        this.$emit('addCancel')
      },
      isModified () {
        if (this.tags.length !== this.rawLength) {
          return true
        }
        for (let tag of this.tags) {
          if (!this.rawTags[tag.menuId]) {
            return true
          }
        }
        return false
      },
      // 获取
      extractMenuIdsFromTags () {
        let menuIds = ''
        this.tags.forEach(value => {
          menuIds += `${value.FunID},`
        })
        menuIds.unshift()
        return menuIds
      },
      // 确定
      handleConfirm () {
        let menuIds = ''
        this.tags.forEach((value, index) => {
          if (index === this.tags.length - 1) {
            menuIds += `${value.FunID}`
          } else {
            menuIds += `${value.FunID},`
          }
        })
        let params = {
          RoleID: this.roleId,
          FunID: `${menuIds}`
        }
        this.$request.post(`/sys/index/setRoleFuncs`, params).then(res => {
          console.log(res.data)
          let data = res.data
          if (data.ID === '0') {
            this.$message('配置失败')
          } else {
            this.$message('配置成功')
            this.handleCancel()
          }
        })
      },
      handleTagClose (tag) {
        this.tags.splice(this.tags.indexOf(tag), 1)
      },
      handleNodeClick (node) {
        for (let tag of this.tags) {
          if (tag.FunID === node.FunID) {
            return
          }
        }
        this.tags.push({
          FunID: node.FunID,
          FunName: node.FunName,
          type: 'success'
        })
      },
      // 过滤
      filterNode (value, data) {
        if (!value) return true
        return data.menuLabel.indexOf(value) !== -1
      },
      // 展示数据
      renderContent (h, { node, data, store }) {
        return (
          <span class="tree_node">
            <span>
              <span
                draggable="true"
                on-click={ () => this.handleNodeClick(data, node) }
                on-dragstart={() => this.dragStart(node, data, store)}
                title={node.label}
                >
                {node.label}
              </span>
            </span>
          </span>
        )
      }
    },
    components: {
    }
}
</script>
<style lang="scss" scoped>
.menuDialog {
  text-align: left;
}
</style>