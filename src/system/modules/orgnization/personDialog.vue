<template>
      <!--查看弹出框-->
    <div class="dialog_box">
      <el-dialog title="人员信息" :visible.sync="localVisible" @close="handleClose">
        <el-row>
          <el-col :span="12">
            <ul class="infoShow">
              <li><span class="keySpan">姓名：</span>{{personInfo.userName}}</li>
              <li><span class="keySpan">手机号：</span>{{personInfo.mobile}}</li>
              <li><span class="keySpan">办公电话：</span>{{personInfo.officeTel}}</li>
            </ul>
          </el-col>
          <el-col :span="12">
            <ul class="infoShow">
              <li><span class="keySpan">性别：</span>{{sex[personInfo.gender]}}</li>
              <li><span class="keySpan">身份证号：</span>{{personInfo.personalId}}</li>
              <li><span class="keySpan">邮箱：</span>{{personInfo.mail}}</li>
            </ul>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
</template>
<script>
  export default {
    props: {
      personInfo: {
        type: Object,
        'default' () {
          return {}
        }
      },
      sex: {
        type: Object,
        'default' () {
          return {}
        }
      },
      visible: {
        type: Boolean,
        'default' () {
          return {}
        }
      }
    },
    data () {
      return {
        localVisible: false
      }
    },
    methods: {
      handleClose () {
        this.$emit('close')
      }
    }, // methods end
    mounted: function () {
    },
    computed: {
    },
    watch: {
      visible () {
        this.localVisible = this.visible
      }
    },
    created () {
    }
  }
</script>
<style lang="scss" scoped>
  .dialog_box{
    width: 1400px;
    margin: 20px auto;
    .el-dialog__title{
      line-height: 1;
      font-size: 16px;
      font-weight: 700;
      color: #1f2d3d;
      margin-left: 42%;
    }
    .infoShow {
      li {
        height: 30px;
        line-height: 30px;
      }
      .keySpan {
        display: inline-block;
        width: 35%;
        text-align: right;
      }
    }
  }
</style>