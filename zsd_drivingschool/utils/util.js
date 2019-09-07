import qs from './qs/index.js'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const rebuildImgUrl = (html, domain) => {
  let imgReg = /<img.*?(?:>|\/>)/gi;
  // 匹配src属性
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  if (html) {
    let arr = html.match(imgReg);
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        let src = arr[i].match(srcReg);
        // 替换链接图片地址
        if (src[1] && src[1].indexOf('http') === -1) {
          html = html.replace('src="' + src[1] + '"', 'src="' + domain + src[1] + '"')
        }
      }
    }
  }
  return html
}
const appGet = (url, params, callBackFun) => {
  return appRequest('GET', params, url, callBackFun)
}
const appPost = (url, params, callBackFun) => {
  return appRequest('POST', params, url, callBackFun)

}

const appRequest = (method, params, url, callBackFun) => {
  //console.log('============app request params')
  //console.log(params)
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    // php 使用indices、python django使用repeat
    data: method === 'post' ? qs.stringify(params, { arrayFormat: 'repeat' }) : params,
    method: method,
    header: {
      // 'content-type': 'application/json' // 默认值
      'content-type': 'application/x-www-form-urlencoded'
    },
    // dataType: 'json',
    success: function (res) {
      //console.log('=============base response json')
      //console.log(JSON.stringify(res.data))
      let response = res.data
      if (response.code === 1) {
        callBackFun(response)
      } else if (response.code === 0) {
        let errMsg = response.message ? response.message : '服务器繁忙, 稍后再试!'
        console.log(errMsg)
      } else if (response.code === -1) {
        login(baseRequest(method, params, url, callBackFun))
      }
      //
    },
    fail: function (err) {
      console.log(err)
      wx.showToast({
        title: '服务器连接失败',
        icon: 'none',
        image: '',
        duration: 10000,
        mask: true,
      })
    },
    complete: function () {
      // 
      wx.hideLoading()
    }
  })
}
const getOptionsQS = (options, name, defVal) => {
  try{
    if (options && options.q && typeof (options.q) === 'string') {
      let url = decodeURIComponent(options.q)
      let reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
      let qsArr = url.match(reg)
      if (qsArr != null) {
        return qsArr[2]
      }
    }
    return defVal
  } catch (err){
    console.log('=========get options q error')
    console.log(err)
    return defVal
  }
  
}
module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  rebuildImgUrl: rebuildImgUrl,
  appGet: appGet,
  appPost: appPost,
  getOptionsQS: getOptionsQS
}
