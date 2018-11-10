// 此处写sys的分支路由信息
const sys = r => require.ensure([], () => r(require('../App')), 'sys')
const menu = r => require.ensure([], () => r(require('../modules/menu/menus')), 'menu')

const personal = r => require.ensure([], () => r(require('../components/personal/personal')), 'personal')
const personalInfo = r => require.ensure([], () => r(require('../components/personal/personalInfo')), 'personalInfo')
const worklog = r => require.ensure([], () => r(require('../components/personal/worklog')), 'worklog')
const password = r => require.ensure([], () => r(require('../components/personal/password')), 'password')

const staff = r => require.ensure([], () => r(require('../modules/staff/staff')), 'staff')
const configure = r => require.ensure([], () => r(require('../modules/staff/configure')), 'configure')
const rolelist = r => require.ensure([], () => r(require('../modules/role/rolelist')), 'rolelist')
const rolemember = r => require.ensure([], () => r(require('../modules/role/rolemembers')), 'rolemember')

const orgnization = r => require.ensure([], () => r(require('../modules/orgnization/orgnization')), 'orgnization')
const sysDict = r => require.ensure([], () => r(require('../modules/sysDict/sysDict')), 'sysDict')

const personInfo = r => require.ensure([], () => r(require('../components/personInfo/dictTable')), 'personInfo')

// 系统统计文件
const statisticTable = r => require.ensure([], () => r(require('../../corpus/modules/corpusStatistic/statisticTable')), 'statisticTable')
// 搜索条件配置
const searchConfig = r => require.ensure([], () => r(require('../modules/searchKey/searchConfig')), 'searchConfig')
const modulePath = '/sys'

const sysRoutes = {
  path: `${modulePath}`,
  name: 'sys',
  component: sys,
  children: [
    {
      path: `personal`,
      component: personal,
      children: [{
        path: '',
        name: 'OaPersonalInfo',
        component: personalInfo
      }, {
        path: 'password',
        name: 'OaPassword',
        component: password
      }, {
        path: 'worklog',
        name: 'Oaworklog',
        component: worklog
      }]
    },
    {
      path: 'menu',
      name: 'menu',
      component: menu
    },
    {
      path: `rolelist`,
      name: 'rolelist',
      component: rolelist
    },
    {
      path: `rolemembers/:roleId`,
      name: 'rolemember',
      component: rolemember
    },
    {
      path: `staff`,
      name: 'staff',
      component: staff
    },
    {
      path: `roleByUser/:UserID`,
      name: 'roleByUser',
      component: configure
    },
    {
      path: `orgnization`,
      name: 'orgnization',
      component: orgnization
    },
    {
      path: `sysDict`,
      component: sysDict,
      name: sysDict
    },
    {
      path: `personInfo`,
      component: personInfo,
      name: personInfo
    },
    {
      path: 'statisticTable',
      component: statisticTable
    },
    {
      path: 'searchConfig',
      component: searchConfig
    }
  ]
}

export default sysRoutes
