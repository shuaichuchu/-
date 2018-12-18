var that;
var username;
var pwd;
var validate;
var md5;
var app = getApp();
var mInt = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logintext: '登录',
    animationData: '',
    left: '-80px',
    animationHeader: '',
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    validate = app.wxValidate({
      phone: {
        required: true,
      },
      password: {
        required: true,
      }
    }, {
        phone: {
          required: '请输入账号',
        },
        password: {
          required: '请输入密码',
        }
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onsubmit: function (e) {
    //防止暴力点击
    that.setData({
      disabled: true
    });
    if (!validate.checkForm(e)) {
      const error = validate.errorList[0];
      wx.showToast({
        title: error.msg,
        icon: 'none',
        duration: 2000,
      })
      that.setData({
        disabled: false
      });
      return false;
    }
    var formData = e.detail.value;
    wx.showLoading({
      title: '登录中...',
    })
    //开始登录，改变按钮文字
    that.setData({
      logintext: '登录中...'
    });
    var key = "Xh207" + new Date().getDate() + new Date().getHours() + "password=" + e.detail.value.password+ "phone=" + e.detail.value.phone;
    key = app.md5(key);
    wx.request({
      url: app.globalData.murl +'/stove/front/login/login',
      data: { phone: e.detail.value.phone, password: e.detail.value.password,Key:key},
      header: {
        'Content-Type': 'application/json'
      },
      success(data) {
        wx.hideLoading();
        if (200 == data.data.code){
          app.globalData.userInfo.phone = e.detail.value.phone;
          app.globalData.userInfo.password = e.detail.value.password;
          wx.setStorageSync("token", JSON.parse(data.data.details).token);
          wx.setStorageSync("comId", JSON.parse(data.data.details).comId);
          wx.setStorageSync("userId", JSON.parse(data.data.details).userId);
          wx.setStorageSync("username", JSON.parse(data.data.details).username);
          wx.hideLoading();
            wx.redirectTo({
              url: '/pages/index/index',
            });
        } else if (400 == data.data.code){
          wx.showToast({
            title: data.data.details,
            icon: 'none',
            duration: 3000,
          })
        }
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: '请重试...',
          icon: 'none',
          duration: 2000,
        })
      },
      complete() {
        
        that.setData({
          logintext: '登录',
          disabled: false
        });
      }
    });
    //关闭登录页面，进入程序主界面
    // wx.redirectTo({
    //   url: '/pages/index/index',
    //   fail() {
    //     wx.showToast({
    //       title: '意料之外的错误，请重试！！！',
    //       icon: 'none',
    //       duration: 2000,
    //     })
    //   }
    // })
  },
  wjpwd: function () {
    wx.navigateTo({
      url: '/pages/wjpwd/wjpwd',
      fail() {
        wx.showToast({
          title: '请重试...',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  }
})