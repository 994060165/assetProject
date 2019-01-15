// 此处写sys的分支路由信息
const sys = r => require.ensure([], () => r(require('../App')), 'sys')
const menu = r => require.ensure([], () => r(require('../modules/menu/menus')), 'menu')

const staff = r => require.ensure([], () => r(require('../modules/staff/staff')), 'staff')
const configure = r => require.ensure([], () => r(require('../modules/staff/configure')), 'configure')
const rolelist = r => require.ensure([], () => r(require('../modules/role/rolelist')), 'rolelist')
const rolemember = r => require.ensure([], () => r(require('../modules/role/rolemembers')), 'rolemember')

const orgnization = r => require.ensure([], () => r(require('../modules/orgnization/orgnization')), 'orgnization')
const sysDict = r => require.ensure([], () => r(require('../modules/sysDict/sysDict')), 'sysDict')

// 搜索条件配置
const searchConfig = r => require.ensure([], () => r(require('../modules/searchKey/searchConfig')), 'searchConfig')

const modulePath = '/sys'

const sysRoutes = {
  path: `${modulePath}`,
  name: 'sys',
  component: sys,
  children: [
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
      path: 'searchConfig',
      component: searchConfig
    }
  ]
}

export default sysRoutes
