let req = require('../../../utils/base.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.baseUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * open-type 获取用户信息
   */

  onGotUserInfo: function (res) {



    console.log("登录============")
    console.log(res)
    if (res.detail.userInfo != undefined) {
      let _this = this
      //小程序登录
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            wx.getUserInfo({ //getUserInfo流程
              success: function (res2) { //获取userinfo成功
                console.log("res2.encryptedData")
                console.log(res2.encryptedData)
                var code = res.code;
                var encryptedData = encodeURIComponent(res2.encryptedData);
                var iv = res2.iv;
                //请求自己的服务器
                console.log("请求自己的服务器")
                wx.request({
                  url: 'https://dream.natappvip.cc/api/wechat/login',
                  data: {
                    code: code,
                    encryptedData: res2.encryptedData,
                    iv: iv,
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/json'
                  }, // 设置请求的 header
                  success: function (res) {
                    let cs_ssid = res.data.data.cs_ssid
                    if (res.data.code === 200) {
                      console.log("SSSSSSSSSSSSSSSSSSSSSSS")
                        wx.switchTab({
                          url: '/pages/user/user_center/user_center',
                        })
                    }
                  }
                })
                wx.setStorageSync("userInfo", res2.userInfo)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    } else {
      wx.showToast({
        title: '请确认授权',
        icon: 'none',
        duration: 2000
      });
      return;
    }
  },
  /**
   * 返回上一页
   */
  goBack: function() {
    app.goBack()
  },
})