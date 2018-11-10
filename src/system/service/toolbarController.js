/* @method isShowToolbar 显示左侧工具栏
 * @return {boolean} true显示左侧工具栏;false 不显示左侧工具栏
 * @create Date: 2017-10-23
 * @Auther: LX
*/
export const isShowToolbar = function () {
  let sRouterPath = this.$route.path
  if (sRouterPath === '/sys/addressbook' || sRouterPath === '/sys/chat') {
    return false
  } else {
    return true
  }
}
