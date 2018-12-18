var that;
var id;//detail的设备id
var repairId;//故障id
var util = require("../../utils/util.js");
var token;
var userId;
var govId;
var cardNum;
var app = getApp();
var md5Key;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:"",
    name: "",
    number: "",
    type: "",
    cardNum: "",
    status: "",
    status_color:"",
    details: "",
    details_display:"",
    faultTime: "",
    faultTime_display:"",
    longitude: "",
    latitude: "",
    address:"",
    markers:[],
    bdisabled:false,
    sdisabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    token = wx.getStorageSync("token");
    userId = wx.getStorageSync("userId");
    id = options.id
    wx.removeStorage({
      key: 'markerclick'
    })
    that = this;
    that.setData({
      height: wx.getSystemInfoSync().windowHeight - wx.getSystemInfoSync().windowHeight*0.2,
    });
    this.getData();
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
  onback: function () {
    that.setData({
      bdisabled:true
    });
    wx.navigateBack({
      delta: 1
    });
  },
  towh:function(){
    that.setData({
      sdisabled: true
    });
    wx.navigateTo({
      url: '/pages/repair/repair?id=' + id + "&name=" + that.data.name + "&number=" + that.data.number 
      + "&govId=" + govId
      + "&type=" + that.data.type + "&cardNum=" + that.data.cardNum +"&repairId="+repairId,
      fail: function (res) {
        wx.showLoading({
          title: '请重试...',
          icon: 'none',
        })
      },
      complete:function(){
        that.setData({
          sdisabled: false
        });
      }
    });
  },
  onPullDownRefresh() {
    this.getData();
  },
  getData(){
    wx.showLoading({
      title: '努力加载中...',
      mask:true
    })
    md5Key = "Xh207" + new Date().getDate() + new Date().getHours() + "equipId=" + id + "userId=" + userId;
    md5Key = app.md5(md5Key);
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.murl +'/stove/front/equipment/wxdetails',
      //url: 'http://localhost/stove/front/equipment/wxdetails',
      data: { equipId: id, token: token, userId: userId, Key: md5Key},
      method: "POST",
      success: function (res) {
        var retData = JSON.parse(JSON.parse(res.data).details);
        repairId = retData.repairId;
        govId = retData.govid;
        that.setData({
          name: retData.name == undefined ? "" : retData.name,
          number: retData.number == undefined ? "" : retData.number,
          type: retData.type == undefined ? "" : retData.type,
          cardNum: retData.cardnum == undefined ? "" : retData.cardnum,
          status: retData.statusStr == undefined ? "" : retData.statusStr,
          status_color: retData.status == 0 ? "#00CD00" : "red",
          details: retData.details == undefined ? "" : retData.details.replace(/<br>/g, ""),
          details_display: retData.status == 0 ? "none" : "block",
          faultTime: retData.faultTime == undefined ? "未知时间" : util.formatTime(new Date(parseInt(retData.faultTime))),
          faultTime_display: retData.status == 0 ? "none" : "block",
          longitude: retData.longitude,
          latitude: retData.latitude,
          address: retData.address,
          markers: [
            {
              iconPath: retData.status == 0 ? "/img/normal.png" : "/img/warning.png",
              id: retData.id,
              latitude: retData.latitude,
              longitude: retData.longitude,
              width: 30,
              height: 30
            }
          ]
        });
      },
      fail: function () {
        wx.showToast({
          title: '请重试...',
          icon: 'none',
          duration: 2000
        });
      },
      complete:function(){
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.hideLoading();
      }
    });
  }
})