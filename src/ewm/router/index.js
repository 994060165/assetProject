// 此处写sys的分支路由信息
const asset = r => require.ensure([], () => r(require('../App')), 'sys')
const assetInfo = r => require.ensure([], () => r(require('../modules/assetInfo/assetInfo')), 'assetInfo')
const modulePath = '/asset'

const assetRoutes = {
  path: `${modulePath}`,
  component: asset,
  children: [
    {
      path: 'assetInfo/:assetId',
      name: 'assetInfo',
      component: assetInfo
    }
  ]
}

export default assetRoutes
