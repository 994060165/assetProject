<template>
  <div id="personal-main">
    <el-col :span="5">
      <div id="left">
        <div class="left_top">
          <div class="lefttopImg" @mouseover="bisntp" @mouseout="dibisntp" @click="ChangeAvatar">
            <img src="../../assets/img/user-default-pic.png" alt="">
            <div :class="{ lefttopImg_blc: lefttopImg_blc }">{{ bianjitup }}</div>
          </div>
          <div class="lefttopText">{{ ruleForm.userName }}</div>
        </div>
        <div class="left_bottom">
          <el-menu default-active="2" class="el-menu-vertical-demo left_bottom_box">
            <el-menu-item index="2" @click.native="goOther('/sys/personal')"><i class="el-icon-edit"></i>个人中心</el-menu-item>
            <el-menu-item index="1" @click.native="goOther('/sys/personal/password')"><i class="el-icon-menu"></i>修改密码</el-menu-item>
            <el-menu-item index="3" @click.native="goOther('/sys/personal/worklog')"><i class="el-icon-setting"></i>登录日志</el-menu-item>
            <!--<el-menu-item index="3" @click.native="goOther('/personal/worklog')"><i class="el-icon-setting"></i>登录日志</el-menu-item>-->
          </el-menu>
        </div>
      </div>
    </el-col>
    <el-col :span="19">
      <div id="right">
        <router-view></router-view>
      </div>
    </el-col>

    <el-dialog title="编辑个人头像":visible="dialogVisible" :showClose="false">
      <div style="border-top: 1px solid #cccccc">
        <div style="margin-top:20px;">
          <div class='room_add_img'>
            <!--<span><img src="./img/tj.png" style="height: 50px;"></span>-->
            <span>上传头像</span>
            <input  @change='upload'  type="file">
          </div>
          <!--<input type="file" id="upload" accept="image" @change="upload">-->
          <!--<label for="upload"></label>-->
        </div>
        <div class="show">
          <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div>
        </div>

        <div class="rightshowb">
          <p>头像说明</p>
          <p>您上传的图片会自动生成3种尺寸，请注意</p>
          <p>小尺寸的头像是否清晰</p>
          <div class="showone">
            <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div>
          </div>
          <p>120*120</p>
          <div class="showone showsec">
            <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div>
          </div>
          <p>48*48</p>
          <div class="showone showthr">
            <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div>
          </div>
          <p>28*28</p>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" style="clear: both;">
        <el-button @click="resetsdgs">取 消</el-button>
        <el-button type="primary" @click="confirmChangeAvatar">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { queryStaffInfo } from '../../service/home'

  export default {
    data () {
      return {
        ruleForm: [],
        lefttopImg_blc: false,
        bianjitup: '',
        dialogVisible: false,
        headerImage: ''
      }
    },
    mounted () {
      this.queryInfo()
    },
    computed: {
    },
    watch: {
    },
    methods: {
      bisntp () {
        this.lefttopImg_blc = true
        this.bianjitup = '编辑'
      },
      dibisntp () {
        this.lefttopImg_blc = false
        this.bianjitup = ''
      },
      ChangeAvatar () {
        console.log('更换头像')
        this.dialogVisible = true
      },
      resetsdgs () {
        this.dialogVisible = false
        this.headerImage = ''
      },
      confirmChangeAvatar () {
        this.dialogVisible = false
        console.log(this.headerImage)
      },
      upload (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        this.picValue = files[0]
        this.imgPreview(this.picValue)
      },
      imgPreview (file) {
        let self = this
        let Orientation
        if (!file || !window.FileReader) return
        if (/^image/.test(file.type)) {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onloadend = async function () {
            let result = this.result
            let img = new Image()
            img.src = result
            if (this.result.length <= (100 * 1024)) {
              self.headerImage = this.result
//              self.postImg()
            } else {
              img.onload = function () {
                let data = self.compress(img, Orientation)
                self.headerImage = data
//                self.postImg()
              }
            }
          }
        }
      },

      goOther (pathParam) {
        this.$router.push({
          path: pathParam
        })
      },
      queryInfo () {
        queryStaffInfo().then(data => {
          this.ruleForm = data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import url("//unpkg.com/element-ui@1.4.4/lib/theme-default/index.css");
  #personal-main{
    margin: 10px 300px;
    #left{
      float: left;
      width: 200px;
      height:800px;
      background-color: #ffffff;
      margin-right: 20px;
      .lefttopImg{
        margin: 20px 40px;
        display: block;
        width: 120px;
        height: 100%;
        overflow: hidden;
        border-radius: 100%;
        background-color: white;
        position: relative;
        .lefttopImg_blc{
          display: block;
          position: absolute;
          bottom: 11px;
          height: 24px;
          width: 100%;
          background-color: darkgoldenrod;
          z-index: 2;
        }
      }
      .left_bottom{
        margin-top: 20px;
        .left_bottom_box{
          background-color: #ffffff;
        }
        .active{
          color: #20a0ff;
        }
      }
    }
    #right{
      width: 796px;
      background: #fff;
      margin-left: 20px;
      float: left;
      overflow: hidden;
    }
    .show {
      width: 53%;
      height: 360px;
      overflow: hidden;
      position: relative;
      /*border-radius: 50%;*/
      border: 1px solid #d5d5d5;
      float: left;
      .picture {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
    .room_add_img{
      width: 188px;
      height: 38px;
      margin-bottom: 20px;
      border:1px solid #e1e1e1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      position: relative;
      >span:nth-child(1){
        margin-top: 10px;
        width: 120px;
        overflow: hidden;
      }
      input{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 99999;
        opacity: 0;
      }
    }
    .rightshowb{
      float: left;
      margin-left: 20px;
      padding-left: 20px;
      border-left: 1px solid;
      p{
        display: block;
        clear: both;
        padding: 5px;
      }
      .showone {
        width: 120px;
        height: 120px;
        overflow: hidden;
        position: relative;
        border-radius: 50%;
        border: 1px solid #d5d5d5;
        float: left;
        margin-left: 30%;
        .picture {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
      .showsec{
        width: 48px;
        height: 48px;
        clear: both;
        margin-left: 43%;
        margin-top: 20px;
      }
      .showthr{
        clear: both;
        width: 28px;
        height: 28px;
        margin-left: 47%;
        margin-top: 20px;
      }
    }
  }

</style>
