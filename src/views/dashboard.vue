<template>
<div>
    <p class="index-title">资产统计</p>
    <el-row>
      <el-col :span="12">
        <div class="index-count">
          <p class="index-subtitle">资产分布情况:</p>
          <div class="row index-count">
            <div class="col-100" id="myChart-pie" :style="{width: '100%', height: '200px'}"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="index-count">
          <p class="index-subtitle">资产分布情况:</p>
          <div class="row index-count">
            <div class="col-100" id="myChart-bar" :style="{width: '100%', height: '250px'}"></div>
          </div>
        </div>
      </el-col>
    </el-row>
</div>
</template>
<style>

</style>
<script>
import api from '@/api'
export default {
  data () {
    return {
      pieData: {}
    }
  },
  mounted () {
    this.getData()
    this.drawBar()
  },
  methods: {
    changeData (dataArry) {
      let obj = {
        title: {
          show: true,
          left: '33.5%',
          top: '32%',
          text: '总资产数',
          textStyle: {
            color: '#3d84bc',
            fontSize: 14
          },
          itemGap: 10,
          subtext: '总资产数',
          subtextStyle: {
            color: '#333',
            fontSize: 14
          }
        },
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 35,
          y: 20,
          itemGap: 10,
          type: 'scroll',
          itemWidth: 12,
          itemHeight: 8,
          data: []
        },
        color: ['#4284b8', '#539cbc', '#63b796', '#a8cf52', '#d5c241', '#de8f26', '#da736e', '#aa72b1'],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            center: ['38%', '45%'],
            itemStyle: {
              borderWidth: 5,
              borderColor: '#fff'
            },
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              // {value: 23, name: '台式机'},
              // {value: 3, name: '投影仪'},
              // {value: 6, name: '笔记本'},
              // {value: 9, name: '电脑桌'},
              // {value: 11, name: '服务器'},
              // {value: 16, name: '路由'},
              // {value: 21, name: '空调'},
              // {value: 20, name: '风扇'}
            ]
          }
        ]
      }
      let arr = []
      let nameArr = []
      dataArry.forEach(value => {
        let obj = {}
        if (value.category) {
          obj.name = value.category
          obj.value = value.num
        } else {
          obj.name = '其它'
          obj.value = value.num
        }
        nameArr.push(obj.name)
        arr.push(obj)
      })
      obj.legend.data = nameArr
      obj.series[0].data = arr
      this.drawPie(obj)
    },
    getData () {
      api.getReportDataToEchar().then(data => {
        if (data.category) {
          this.changeData(data.category)
        }
      })
    },
    drawPie (obj) {
      // 基于准备好的dom，初始化echarts实例
      let myChartPie = window.echarts.init(document.getElementById('myChart-pie'))
      // 绘制图表
      myChartPie.setOption(obj)
    },
    drawBar () {
      let myChartBar = window.echarts.init(document.getElementById('myChart-bar'))
      // 绘制图表
      myChartBar.setOption({
        backgroundColor: '#fff',
        xAxis: {
          type: 'category',
          data: ['北京', '沈阳', '长春', '上海', '南京', '武汉', '广州', '成都', '昆明', '西安', '兰州', '新疆']
        },
        yAxis: {
          type: 'value',
          axisTick: {
          }
        },
        tooltip: {
          show: true,
          axisPointer: {
            show: true,
            label: {
              show: true
            },
            type: 'cross'
          }
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 330, 150, 80, 70, 110, 560],
          type: 'bar',
          barWidth: 8, // 柱图的宽度
          itemStyle: {
            normal: {
              color: new window.echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#80bdf6'},
                  {offset: 0.5, color: '#1a8fef'},
                  {offset: 1, color: '#178def'}
                ]
              )
            },
            emphasis: { // 强调样式
              color: new window.echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#2378f7'},
                  {offset: 0.7, color: '#2378f7'},
                  {offset: 1, color: '#83bff6'}
                ]
              )
            }
          }
        }]
      })
    }
  }
}
</script>
