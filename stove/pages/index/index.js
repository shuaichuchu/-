var mmap;
var key = 'RWLBZ-366W6-XMOSW-M6PI7-QWRXH-NSFUP';
var QQMapWX = require('../../js/qqmap-wx-jssdk.js');
var qqmapsdk;
var address;
var that;
var mdata;
var interval;
var app = getApp();
var token;
var userId;
var canTap;
var first;
var md5Key;
Page({
  data: {
    polyline:[],
    scale:14,
    blongitude: 116.8,
    blatitude: 39.95,
    markers:[],
    flag:false,
    totop:350,
    navheight:"",
  },
  onLoad: function () {
    //wx.clearStorageSync();
    that = this;
    that.setData({
      navheight:wx.getSystemInfoSync().statusBarHeight+"drp"
    });
  },
  onShow:function(){
    that.setData({
      totop: (wx.getSystemInfoSync().screenHeight),
    });
    first = true;
    canTap = true;
    token = wx.getStorageSync("token");
    userId = wx.getStorageSync("userId");
    if (null == token || "" == token || undefined == token) {
      wx.redirectTo({
        url: '/pages/login/login',
      });
      return;
    }
    //定位，获取当前用户位置，地图以用户当前位置为中心
    wx.getLocation({
      success: function(res) {
        that.setData({
          blongitude:res.longitude,
          blatitude:res.latitude,
        });
      },
    })
    //显示页面的转发按钮
    wx.showShareMenu({
      withShareTicket: true
    });
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: key
    });
    mmap = wx.createMapContext("mymap");
    this.getData();
    interval = setInterval(this.getData,10*1000);
  },
  onReady:function(){
    var that = this;
  },
  markertap:function(e){
    if (canTap){
      canTap = false;
      setTimeout(function(){
        canTap = true
      },2000);
    } else {
      return false;
    }
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.markerId,
      success:function(res){
        clearInterval(interval);
      },
      fail:function(res){
        wx.showToast({
          title: '请重试...',
          icon: 'none',
          duration: 2000,
        })
      },
      complete:function(res){
        //wx.hideLoading();
        
      }
    });
  },
  onHide:function(){
    if (null != interval){
      clearInterval(interval);
    }
  },
  getData(){
      wx.showNavigationBarLoading();
      md5Key = "Xh207" + new Date().getDate() + new Date().getHours() + "userId=" + userId ;
      md5Key = app.md5(md5Key);
    var mapdata = new Array();
    var mak;
    var content;
    var status;
    var icon;
    wx.request({
      url: app.globalData.murl +'/stove/front/equipment/wxlist',
      //url: 'http://localhost/stove/front/equipment/wxlist',
      data: { token: token, userId: userId, Key:md5Key},
      method:"POST",
      success: function (res) {
        if (200 == JSON.parse(res.data).code){
          mdata = JSON.parse(JSON.parse(res.data).details);
          if (null != mdata && 0 != mdata.length) {
            for (var i = 0; i < mdata.length; i++) {
              status = mdata[i].status;
              if (0 == parseInt(status)) {
                icon = "/img/normal.png";
              } else {
                icon = "/img/warning.png";
              }
              mak = {
                id: mdata[i].id,
                latitude: mdata[i].latitude,
                longitude: mdata[i].longitude,
                iconPath: icon,
                width: 30,
                height: 30,
              };
              mapdata.push(mak);
            }
          }
          //设置data数据
          that.setData({
            markers: mapdata,
          });
        }
        if (401 == JSON.parse(res.data).code){
          clearInterval(interval);
          wx.showModal({
            title: '提醒',
            content: '账号已过期，请重新登录^_^',
            showCancel:false,
            confirmText:"去登录",  
            success:function(){
              wx.redirectTo({
                url: '/pages/login/login',
              });
            }
          })
 
        }
      },
      fail:function(res){
        wx.showToast({
          title: '正在重试...',
          icon: 'loading',
          duration: 2000,
        })
      },
      complete(){
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    });
  },
  getlocation:function(){
    //定位，获取当前用户位置，地图以用户当前位置为中心
    wx.getLocation({
      success: function (res) {
        that.setData({
          blongitude: res.longitude,
          blatitude: res.latitude,
          scale: 14,
        });
      },
    })
  },
  getuser:function(){
    wx.navigateTo({
      url: '/pages/my/index',
    })
  }
})
