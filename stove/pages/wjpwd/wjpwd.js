var that;
var validate;
var app = getApp();
var phone;
var password;
var md5Key;
// login/wjpwd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    submit: '发送',
    disbaled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    phone = app.globalData.userInfo.phone;
    password = app.globalData.userInfo.password;
    validate = app.wxValidate({
      email: {
        required: true,
        email: true,
      }
    }, {
        email: {
          required: '请填写您的邮箱',
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
    if (!validate.checkForm(e)) {
      const error = validate.errorList[0];
      wx.showToast({
        title: error.msg,
        icon: 'none',
        duration: 2000,
      });
      return false;
    }
    var email = e.detail.value.email;
    that.setData({
      submit: '发送中...',
      disbaled:true
    });
    md5Key = "Xh207" + new Date().getDate() + new Date().getHours() + "email=" + email;
    md5Key = app.md5(md5Key);
    wx.request({
      url: app.globalData.murl +'/stove/front/login/retrievePwd',
      data: { email: email ,name:md5Key},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (200 == JSON.parse(res.data).code){
          wx.showModal({
            title: '提示',
            content: '邮件发送成功，请前往您的邮箱修改密码^_^',
            showCancel:false,
            success:function(){
              wx.redirectTo({
                url: '/pages/login/login',
              })
            }
          })
        }
        if (400 == JSON.parse(res.data).code || 401 == JSON.parse(res.data).code) {
          wx.showModal({
            title: '提示',
            content: JSON.parse(res.data).details,
            showCancel: false,
          })
        }
      },
      fail: function (res) { },
      complete: function (res) {
        that.setData({
          submit: '提交',
          disbaled: false
        });
      },
    })
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  }
})