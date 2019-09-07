const app = getApp()
/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs(pages) {
  //获取加载的页面 pages = getCurrentPages() 
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}
function getPageInfo(pages, pageType){
  /*获取页面信息属性*/
  let pageInfo = getPageInfoAll(pages)
  return pageInfo[pageType]
}
function getPageInfoAll(pages) {
  /*获取当前页面信息*/
  //console.log('==================log JSON.stringify(pageInfo)')
  //console.log(JSON.stringify(pages))
  let currentPage = pages[pages.length - 1]
  let pageInfo = {
    pages: pages,  // 获取加载的页面
    currentPage: currentPage,   // 获取当前页面的对象
    url: currentPage.route,    // 当前页面url
    options: currentPage.options    // 如果要获取url中所带的参数可以查看options
  }
  //console.log('==================log JSON.stringify(pageInfo)')
  //console.log(JSON.stringify(pageInfo))
  return pageInfo

}
module.exports = {
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  getPageInfo: getPageInfo,
  getPageInfoAll: getPageInfoAll
}