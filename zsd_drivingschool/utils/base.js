import * as qs from './qs/index'

const app = getApp()
let baseUrl = app.baseUrl

const baseGet = (url, params, callBackFun, isloading, allcallBack) => {
    // GET方法提交
    if (isloading === '' || isloading === undefined || isloading === true) {
        isloading = true
    }
    if (allcallBack === '' || allcallBack === undefined || allcallBack === false) {
        allcallBack = false
    }else{
        allcallBack = true
    }
    if(wx.getStorageSync('userSession')){
        return baseRequest('GET', params, baseUrl + url, callBackFun, isloading, allcallBack)
    }else{
        return getOpenId(function(){baseRequest('GET', params, baseUrl + url, callBackFun, isloading, allcallBack)})
    }
}

const basePost = (url, params, callBackFun, isloading, allcallBack) => {
    // POST方法提交
    if (isloading === '' || isloading === undefined || isloading === true) {
        isloading = true
    }
    if (allcallBack === '' || allcallBack === undefined || allcallBack === false) {
        allcallBack = false
    }else{
        allcallBack = true
    }
    if(wx.getStorageSync('userSession')){
        return baseRequest('POST', params, baseUrl + url, callBackFun, isloading, allcallBack)
    }else{
        return getOpenId(function(){baseRequest('POST', params, baseUrl + url, callBackFun, isloading, allcallBack)})
    }
}

const baseRequest = (method, params, url, callBackFun, isloading, allcallBack, doactionnum) => {

    params = getRequestParam(params)
    if (isloading === true) {
        wx.showLoading({
            title: '加载中',
        })
    }
    if (allcallBack != true) {
        allcallBack = false
    }
    wx.request({
        url: url, //仅为示例，并非真实的接口地址
        // php 使用indices、python django使用repeat
        data: method === 'post' ? qs.stringify(params, {arrayFormat: 'repeat'}) : params,
        method: method,
        header: {
            // 'content-type': 'application/json' // 默认值
            'content-type': 'application/x-www-form-urlencoded'
        },
        // dataType: 'json',
        success: function (res) {
            wx.hideLoading()
            //console.log('=============base response json')
            //console.log(JSON.stringify(res.data))
            let response = res.data
            if (response.code === 1) {
                callBackFun(response)
            } else if (response.code === 0) {
                if(allcallBack){
                    callBackFun(response)
                }else{
                    let errMsg = response.message ? response.message : '服务器繁忙, 稍后再试!'
                    if ( response.message.length > 6) {
                        wx.showModal({
                            title: '提示',
                            content: errMsg,
                            success(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    } else {
                        app.showToast({title: errMsg})
                    }
                }

            } else if (response.code === -1) {
                // 增加登录验证次数限制
                if (!doactionnum) doactionnum = 0
                doactionnum++
                if (doactionnum < 2) {
                    //console.log(doactionnum)
                    getOpenId(function(){baseRequest(method, params, url, callBackFun, isloading, allcallBack, doactionnum)})
                }
            } else if (response.code == -2) {
                callBackFun(response)
            } else {
                app.showToast({title: '操作异常!'})
            }
        },
        fail: function (err) {
            console.log(err)
            wx.hideLoading()
            wx.showToast({
              title: '服务器繁忙，稍后再试',
              icon: 'none',
              image: '',
              duration: 10000,
              mask: true,
            })
        },
        complete: function () {
            //
        }
    })
}

const baseUploadFile = (url, params, filePaths, callBackFun, isloading, doactionnum) => {
    if (isloading === '' || isloading === undefined || isloading === true) {
        isloading = true
    }
    if (isloading === true) {
        wx.showLoading({
            title: '加载中',
        })
    }
    url = baseUrl + url
    params = getRequestParam(params)
    wx.uploadFile({
        url: url,
        filePath: filePaths,
        name: 'file',
        formData: params,
        success: function (res) {
            wx.hideLoading()
            let data = JSON.parse(res.data);
            let response = data
            if (response.code === 1) {
                callBackFun(response)
            } else if (response.code === 0) {
                let errMsg = response.message ? response.message : '服务器繁忙, 稍后再试!'
                if ( response.message.length > 14) {
                    wx.showModal({
                        title: '提示',
                        content: errMsg,
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    app.showToast({title: errMsg})
                }
            } else if (response.code === -1) {
                // 增加登录验证次数限制
                if (!doactionnum) doactionnum = 0
                doactionnum++
                if (doactionnum < 2) {
                    //console.log(doactionnum)
                    getOpenId(function(){baseUploadFile(url, params, filePaths, callBackFun, isloading, doactionnum)})
                }
            } else if (response.code == -2) {
                callBackFun(response)
            } else {
                app.showToast({title: '操作异常!'})
            }
        },
        fail: function (err) {
            console.log(err)
            wx.hideLoading()
            app.showToast({title: '服务器繁忙，稍后再试'})
            //
        },
        complete: function () {
            //
        }
    })
}

const login = (successFun) => {
    wx.login({
        success: res => {
            console.log('============log login')
            //console.log(JSON.stringify(res))
            let callBackFun = function (response) {
                let {code, result} = response
                if (code === 1) {
                    wx.setStorageSync('userSession', result)
                    successFun()
                }
            }
            basePost('/vshop/mobile/', {code: res.code, shopId: app.shopId}, callBackFun)
        }
    })
}

const getRequestParam = (params) => {
    // 获取提交参数
    let userSession = wx.getStorageSync('userSession')
    if (params) {
        params['isApp'] = 1
        params['shopId'] = app.shopId
        params['session_key'] = userSession ? userSession['session_key'] : ''
        params['openid'] = userSession ? userSession['openid'] : ''
        params['encryptedData'] = userSession ? (userSession['encryptedData']?userSession['encryptedData']:"") : ''
        params['iv'] = userSession ? (userSession['iv']?userSession['iv']:"") : ''
        params['mp_session_key'] = userSession ? (userSession['mp_session_key']?userSession['mp_session_key']:"") : ''
        return params
    } else {
        return params
    }
}

const getStrFromStr = (dataList, dots) => {
    dots = dots ? dots : ','
    let dataStr = ''
    if (dataList && dataList.length > 0) {
        for (let item of dataList) {
            dataStr += item + dots
        }
        dataStr = dataStr.substring(0, dataStr.lastIndexOf(dots))
    }
    return dataStr
}

const encodeDotChar = (uri) => {
    // 不转码,字符
    let reg = new RegExp('%2C', "g");
    if (uri.indexOf('%2C') > 0) {
        uri = uri.replace(reg, ',')
    }
    return uri
}

const getOpenId = (callBackFun_after) => {
    // 获取小程序用户OpenId
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        let callBackFun = function (response) {
          let { code, cutstomer_info, result } = response
          if (code === 1) {
            wx.setStorageSync('userSession', result)
            
            if(cutstomer_info){
                wx.setStorageSync('is_customer', 1)
            }else{
                wx.setStorageSync('is_customer', 0)
            }

            wx.getSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      result['encryptedData'] = res.encryptedData
                      result['iv'] = res.iv
                      wx.setStorageSync('userSession', result)

                      requestSaveWechatUserInfo(res.userInfo, function (){
                        wx.setStorageSync('userInfo', res.userInfo)
                        callBackFun_after()
                      })
                    }
                  })
                }else{
                  callBackFun_after()
                }
              }
            })
          }else{
            wx.showToast({
              title: '网络不给力，请关闭后再试......',
              icon: 'none',
              image: '',
              duration: 10000,
              mask: true,
            })
          }
        }
        baseRequest('POST', { code: res.code, shopId: app.shopId }, baseUrl + '/vshop/mobile/', callBackFun)
      },
      fail: res => {
        wx.showToast({
          title: '网络不给力，请关闭后再试......',
          icon: 'none',
          image: '',
          duration: 10000,
          mask: true,
        })
      }
    })
}

const requestSaveWechatUserInfo = (params, callBackFun) => {
  // 保存小程序用户信息
  return basePost('/vshop/save-wechat-user-info/', params, callBackFun)
}


module.exports = {
    baseUrl: baseUrl,
    baseGet: baseGet,
    basePost: basePost,
    baseRequest: baseRequest,
    getStrFromStr: getStrFromStr,
    encodeDotChar: encodeDotChar,
    login: login,
    baseUploadFile: baseUploadFile,
    getOpenId : getOpenId,
    requestSaveWechatUserInfo : requestSaveWechatUserInfo
}