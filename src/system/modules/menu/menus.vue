<template>
  <div class="menuPage">
    <div class="leftT">
      <el-col :span="24" class="toolbar" style="background: white;padding-bottom: 0px;height: 46px">
        <el-row>
          <el-col :span="17">
            <span class="icon" @click="goBack()"></span>
            <span class="title">菜单管理</span>
          </el-col>
        </el-row>
      </el-col>
    </div>
    <div class="rightT">
      <div class="tree">
        <el-tree
          ref="menutree"
          class="menutree"
          :data="menuDatas"
          :props="props"
          :render-content="renderContent"
          node-key="id"
          :expand-on-click-node="true">
        </el-tree>
      </div>
      <div class="rightContemt" v-loading="fullscreenLoading" element-loading-text="拼命加载中">
        <div class="rightH">
          <ul>
            <li>基本信息</li>
          </ul>
        </div>
        <div class="rightC">
          <el-row>
            <el-form :label-position="labelPosition" label-width="155px" :model="menuForm" >
              <el-col :span="12">
              <el-form-item label="菜单显示名称：" class="itemt">
                <el-input placeholder="【菜单名称】" :disabled="menuDisabled" v-model="menuForm.FunName" ></el-input>
              </el-form-item>
              <el-form-item label="是否启用：" class="itemt">
                <el-switch  on-text="是" off-text="否" :disabled="menuDisabled" v-model="isShow"></el-switch>
              </el-form-item>
              <el-form-item label="排序：" class="itemt">
                <el-input type="number" :disabled="menuDisabled" v-model="menuForm.SequenceID"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="菜单URL：" class="itemt" >
                  <el-input placeholder="【/.../.../...】" :disabled="menuDisabled" v-model="menuForm.FunLink"></el-input>
                </el-form-item>
                <el-form-item label="是否是叶子节点：" class="itemt">
                  <el-switch on-text="是" off-text="否"  :disabled="menuDisabled" v-model="isleaf"></el-switch>
                </el-form-item>
                <el-form-item label="业务代码：" class="itemt">
                  <div v-if="editForm">{{menuForm.FunID}}</div>
                  <el-input :disabled="menuDisabled" v-model="menuForm.FunID" v-else></el-input>
                </el-form-item>
                <!-- <el-form-item label="图标：" class="itemt">
                  <div class='finish_room'>
                    <div class='finish_room2'>
                      <div class='room_img' :class="{frame: !addImgVisible}">
                        <img :src="iconImg">
                        <span v-show="!menuDisabled" @click='deleteImg()'>
                          <img src="./img/scc.png" style="height:30px; width:30px;">
                        </span>
                      </div>
                      <div class='room_add_img'  :class="{ createDisable: addImgVisible}">
                        <span><img src="./img/tj.png" style="height: 50px;"></span>
                        <span>上传图片</span>
                        <input title="" @change='addImg' :disabled="menuDisabled" type="file">
                      </div>
                    </div>
                  </div>
                </el-form-item> -->
                <!-- <el-form-item label="备注：" class="itemt">
                  <el-input placeholder="【......】" :disabled="menuDisabled"  v-model="menuForm.title"></el-input>
                </el-form-item> -->
              </el-col>
            </el-form>
            </el-row>
            <el-row style="margin-top: 30px;">
              <el-col :span="24" v-if="menuDisabled && menuFormVisible"><el-button class="btn1"  @click="edit">编辑</el-button></el-col>
              <el-col :span="12" v-else-if="!menuDisabled"><el-button class="btn2" @click="addMenu">保存</el-button></el-col>
              <el-col :span="12" v-if="!menuDisabled"><el-button class="btn3" @click="cancel">取消</el-button></el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 正式
      labelPosition: '',
      fullscreenLoading: false,
      menuFormVisible: false,
      menuLevel: 0,
      menuForm: {},
      isShow: true,
      isleaf: false,
      addImgVisible: false,
      menuDisabled: true,
      menuDatas: [],
      props: {
        id: 'InnerID',
        label: 'FunName',
        children: 'children'
      },
      iconImg: '',
      editForm: false
    }
  },
  mounted () {
    this.getMenusData()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
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
        console.log(one, two)
        this.menuDatas = one
      })
    },
    // 展示数据
    renderContent (h, { node, data, store }) {
      return (
        <div class="tree_node" style="width: 100%;">
          <span>
            <span
              on-click={ () => this.handleNodeClick(data, node) }
              title={node.label}
              >
              {node.label}
            </span>
          </span>
          <span class="btnr" style="float: right; margin-right: 20px">
            <el-button size="mini" on-click={ () => this.append(store, data, node)} icon="el-icon-plus"></el-button>
            <el-button size="mini" on-click={ () => this.remove(store, data, node)} icon="el-icon-delete"></el-button>
          </span>
        </div>
      )
    },
    // 重置菜单项
    refreshMenuForm () {
      this.editForm = false
      this.iconImg = ''
      this.isShow = true
      this.isleaf = false
      let params = {
        FunName: '',
        FunID: '',
        FatherID: '',
        FunLink: '',
        MenuLevelID: '',
        Icon: '',
        SequenceID: ''
      }
      return params
    },
    // 添加菜单触发
    append (store, data, node) {
      console.log(data)
      this.menuDisabled = false
      let form = Object.assign({}, this.refreshMenuForm())
      form.FatherID = data.FunID
      form.MenuLevelID = parseInt(data.MenuLevelID) + 1
      this.menuForm = form
    },
    // 添加Menu
    addMenu () {
      this.fullscreenLoading = true
      let form = Object.assign({}, this.menuForm)
      if (this.isShow) {
        form.DisplayTag = '1'
      } else {
        form.DisplayTag = '0'
      }
      if (this.isleaf) {
        form.LeafLag = '1'
      } else {
        form.LeafLag = '0'
      }
      if (form.children) {
        delete form.children
      }
      // form.Icon = this.iconImg
      this.$request.post(`/sys/index/putTree`, form).then(res => {
        this.fullscreenLoading = false
        let data = res.data
        if (data.ID === '-1') {
          this.$message(`${data.msg}`)
        } else {
          this.$message('success')
          this.menuDisabled = true
          this.getMenusData()
        }
      }, err => {
        console.log(err)
        this.fullscreenLoading = false
        this.$message(`保存失败`)
      })
    },
    // 添加图片
    addImg (event) {
      let reader = new FileReader()
      let img = event.target.files[0]
      reader.readAsDataURL(img)
      let that = this
      reader.onloadend = function () {
        that.iconImg = reader.result
        that.addImgVisible = true
      }
    },
    // 删除图片
    deleteImg () {
      this.iconImg = ''
      this.addImgVisible = false
      console.log()
    },
    // 点击界面菜单
    handleNodeClick (data, node) {
      this.menuDisabled = true
      this.menuFormVisible = true
      let form = data
      // this.iconImg = data.Icon
      if (form.DisplayTag === '1') {
        this.isShow = true
      } else {
        this.isShow = false
      }
      if (form.LeafLag === '1') {
        this.isleaf = true
      } else {
        this.isleaf = false
      }
      this.menuForm = form
    },
    edit () {
      this.menuDisabled = false
      this.editForm = true
    },
    cancel () {
      this.menuDisabled = true
      this.editForm = false
    },
    refreshPage: function () {
      this.$router.replace('/sys/skip')
    },
    remove (store, data) {
      let params = {
        FunID: data.FunID
      }
      console.log(data)
      var r = confirm('该菜单对应的角色、部门、分组关联关系将一并删除，是否确认删除？')
      if (r === true) {
        this.$request.post(`/sys/index/deletetree`, params).then(res => {
          this.$message('删除成功')
          this.getMenusData()
        }, err => {
          console.log(err)
          this.$message('删除失败')
        })
      } else {
      }
    }
  }
}
</script>
<style lang="scss">
.menuPage {
  .tree_node {
    width: 100%;
    color: black;
  }
  .btnr {
    font-weight: bold;
    i {
      font-weight: 900;
    }
  }
}
</style>

<style lang="scss" scoped>

  .menuPage{
    display: block;
    height: 100%;
    // margin-right: 10px;
    .leftT{
      display: flex
    }
    .rightT{
      margin-right: 20px;
      display: flex;
      .tree{
        width: 370px;
        font-size: 14px;
        font-family: '微软雅黑';
        text-align: left;
        margin-right: 10px;
        margin-left: 10px;
        background: white;
      }
    }
    .rightContemt{
      width: 100%;
      height: fit-content;
      padding-left: 5px;
      background-color: #fff;
      .rightH{
        height: 43px;
        padding: 0 20px;
        border: none;
        border-bottom: 1px solid #dedede;
        ul{
          width: 105px;
          height: 43px;
          line-height: 43px;
          padding: 0 20px;
          border: none;
          border-bottom: 1px solid #dedede;
          li{
            color: #0181e4;
            border-bottom: 2px solid #0181e4;
          }
        }
      }
      .rightC{
        padding: 20px;
      }
    }
  }
.tj{
  background: url('./img/tj.png') 0 0 no-repeat
}
.itemt{
  text-align: left;
  margin-bottom: 15px;
}
.btn1{
  color: #0181e4;
  border-color: #0181e4;
  margin-left: 5px;
  margin-right: 5px;
  font-size: 16px;
  padding: 5px 8px;
  min-width: 80px;
  height: 34px;
}
.btn2{
  color: #fff;
  border-color: #f90;
  margin-left: 5px;
  margin-right: 5px;
  font-size: 16px;
  padding: 5px 8px;
  min-width: 80px;
  height: 34px;
  float: right;
  background-color: #f90;
}
.btn3{
  color: #fff;
  border-color: #f90;
  margin-left: 5px;
  margin-right: 5px;
  font-size: 16px;
  padding: 5px 8px;
  min-width: 80px;
  height: 34px;
  float: left;
  background-color: #f90;
}
.btn1:hover{
  color: #fff;
  background-color: #0181E4;
}
.btn2:hover{
  background-color:rgba(255, 153, 0, 0.8);
}
.el-tree-node__content:hover{
  background-color: red
}
.btnr{
  display: none;
}
.btnr:hover{
  display: block;
}

.finish_room{
  height: auto;
}
.finish_room2{
  width: 100%;
  height: auto;
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
}
.finish_room2 .room_img{
  width: 150px;
  height: 100px;
  margin-right: 10px;
  overflow: hidden;
}
.finish_room2 .room_img img{
  width: 100%;
  height: 100%;
}
.finish_room2>.room_img span{
  position: absolute;
  width: auto;
  height: auto;
  left: 170px;
  bottom: 3px;
  cursor: pointer;
}
.room_add_img{
  width: 148px;
  height: 98px;
  text-align: center;
  border:1px solid #e1e1e1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
}
.room_add_img >span:nth-child(1){
  margin-top: 10px;
  width: 120px;
  /*height: 40px;*/
  overflow: hidden;
}
.room_add_img >span:nth-child(2){
  margin-bottom: 5px;
}
.room_add_img input{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 99999;
  opacity: 0;
  cursor: pointer;
}
.createDisable,.frame{
  display: none;
}
.createDisable1,.frame1{
  display: none;
}
.toolbar {
  height: 46px;
  line-height: 46px;
  background: #fff;
  margin-bottom: 20px;
  .icon {
    background: url(../../assets/img/personnel/goback.png) center center no-repeat;
    display: inline-block;
    width: 40px;
    height: 46px;
    line-height: 46px;
    float: left;
    cursor: pointer;
  }
  .icon:hover {
    background: url(../../assets/img/personnel/goback-hover.png) center center no-repeat;
  }
  .title {
    font-size: 18px;
    color: #000;
    padding: 0;
    height: 46px;
    line-height: 46px;
    margin-top: 0;
    float: left;
  }
}
</style>
