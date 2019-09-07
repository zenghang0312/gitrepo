//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    scrollTop:0,
   
    swiperImgs:[{
      id:0,
      img:'https://www.dsils.cn/banner/banner1.jpg'
    }, {
        id: 0,
        img: 'https://www.dsils.cn/banner/banner2.jpg'
      },{
        id: 0,
        img: 'https://www.dsils.cn/banner/banner3.jpg'
      },{
        id: 0,
        img: 'https://www.dsils.cn/banner/banner4.jpg'
      }]
  },
  
  onLoad: function () {
  },
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
                    if (res.data.code === 1) {
                      console.log("*********授权成功")
                      if (res.data.data.is_set === 0) { //未选择标签

                        wx.redirectTo({
                          url: '/pages/welcome/welcome_one/welcome_one',
                        })
                      } else if (res.data.data.is_set === 1) {
                        wx.switchTab({
                          url: '/pages/mall/mall',
                        })
                      }
                      wx.setStorageSync('cs_ssi', cs_ssid)
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
  onPageScroll: function (ev) {
    var _this = this;

    //给scrollTop重新赋值    
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop
      })

    })
  },
})
