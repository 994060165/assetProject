<template>
  <div id="right" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="righttop"><h4>登陆日志</h4></div>
    <div class="content" v-if="content">
      <ul class="headerBar headerBar_box">
        <li style="width:13%;">序号</li>
        <li style="width:20%;">&nbsp;登录账号</li>
        <li style="width:20%;">登录时间</li>
        <li style="width:20%;">操作系统</li>
        <!--<li style="width:37%;">IP地址</li>-->
        <li style="width:20%;">访问错误次数</li>
      </ul>
      <div :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
        <ul v-for="item in worklogList" class="headerBar worklog_log">
          <li style="width:13%;">{{item.number}}</li>
          <li style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.loginCode}}</li>
          <li style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.time}}</li>
          <li style="width:25%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap; ">{{item.userAgent}}</li>
          <li style="width:10%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap; ">{{item.errorNum}}</li>
        </ul>
      </div>
      <div>
        <el-col :span="5"><p class="pageCount">共有 <span class="badge">{{ count }}</span> 条记录</p></el-col>
        <el-col :span="18"><el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalCount "></el-pagination></el-col>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'

  import { getWorklog } from '../../service/home'
  import ElCol from 'element-ui/packages/col/src/col'
  export default {
    data () {
      return {
        allLoaded: false,
        page: 1,
        worklogList: [],
        count: '',
        content: true,
        loading2: false,
        totalCount: 1000
      }
    },
    mounted () {
      moment.locale('zh-cn')
      this.queryWorklog(1)
    },
    computed: {
    },
    watch: {
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      queryWorklog (page) {
        this.loading2 = true
        setTimeout(() => {
          this.loading2 = false
          this.page = page
          let params = 'page=' + page + '&pageSize=10'
          getWorklog(params).then(res => {
            let headers = res.headers
            this.count = headers.count
            this.totalCount = parseInt(headers.count)
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].time = moment(res.data[i].loginTime).format('YYYY-MM-DD')
            }
            if (this.page === 1 && res.data.length === 0) {
              this.content = false
            }
            if (res.data.length > 0) {
              this.worklogList = res.data
              for (let i = 0; i < this.worklogList.length; i++) {
                this.worklogList[i].number = i + 1
              }
              this.content = true
//            console.log(this.worklogList)
            } else {
              this.bottomText = '暂无更多数据'
              return false
            }
          })
        }, 1000)
      },
      loadBottom () {
        this.page += 1
        if (this.page > Math.ceil(this.count / 10)) {
//          Toast({
//            message: '暂无更多数据',
//            position: 'middle',
//            duration: 2000
//          })
          alert('暂无更多数据')
        }
        setTimeout(this.queryWorklog(this.page), 1500)
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (page) {
        console.log(page)
        this.queryWorklog(page)
      }
    },
    created () {

    },
    components: {
      ElCol
    }
  }
</script>
<style lang="scss" scoped>
  #right{
    height:100%;
    .headerBar {
      font-size: 14px;
      border-bottom: 1px solid #d9d9d9;
      height: 38px;
      line-height: 38px;
      text-align: left;
      width: 89%;
      margin-left: 3%;
      li{
        display: inline-block;
        float: left;
        text-align: center;
      }
    }
    .headerBar_box{
      background-color: #F2F2F2;
    }
    .worklog_log:hover{
      background-color: #e5e5e5;
    }
    .count {
      // width: 100%;
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      padding-left: 10px;
      text-align: left;
    }
    .badge{
      background: 0 0;
      color: #ff9000;
      font-weight: 400;
      padding: 3px;
    }
  }
</style>
