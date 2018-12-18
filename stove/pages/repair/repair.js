// pages/repair/repair.js
var that;
var forminfo = [];//故障维护集合
var dforminfo = [];//日常维护集合
var id;
var userId;
var comId;
var govId;
var cardNum;
var repairId;
var mark;
var token;
var app = getApp();
var bg=[]; 
var md5Key;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:false,
    name: "",
    number: "",
    type: "",
    cardNum: "",
    bgColor:[]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    id = options.id;
    cardNum=options.cardNum;
    govId=options.govId;
    userId = wx.getStorageSync("userId");
    token = wx.getStorageSync("token");
    comId = wx.getStorageSync("comId");
    repairId = options.repairId;
    that.setData({
      name: options.name == null ? "" : options.name,
      number: options.number == null ? "" : options.number,
      type: options.type == null ? "" : options.type,
      cardNum: options.cardNum == null ? "" : options.cardNum
    });
    for(let i=1;i<23;i++){
      bg[i] ='#1CD700';
    }
    that.setData({
      bgColor: bg
    })

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
    forminfo = [];
    dforminfo = [];
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
  clickgz: function (e) {
    if (bg[e.target.id] =='#1CD700'){
      bg[e.target.id] = 'red';
      that.setData({
        bgColor: bg,
      });
      if (e.target.id < 9 || e.target.id==22){
       dforminfo.push(e.target.id);
      }else{
        forminfo.push(e.target.id);
      } 
    }else{
      bg[e.target.id] = '#1CD700';
      that.setData({
        bgColor: bg,
      });
      if (e.target.id < 9 || e.target.id == 22){
        that.removeinfo(dforminfo, e.target.id);
      }else{
        that.removeinfo(forminfo, e.target.id);
      }
    }
    console.log("日常维护："+dforminfo);
    console.log("故障维护："+forminfo);
  },
  removeinfo(info, id) {
    for (var i = 0; i < info.length; i++) {
      if (info[i] == id) {
        //删除数组指定位置元素
        info.splice(i, 1);
      }
    }
  },
  onback: function () {
    wx.navigateBack({
      delta: 2
    });
  },
  onsub: function (e) {
    that.setData({
      disabled:true
    });
    wx.showLoading({
      title: '提交中...',
    })
    var checkItems = '[';
    if (dforminfo.length>0){
      for (var i = 0; i < dforminfo.length; i ++){
            if(i==0){
                checkItems += '"'+dforminfo[i]+'"';
            }else{
              checkItems+=',"'+dforminfo[i]+'"';
            }
      }
    }
    checkItems= checkItems+']';
    var faultItems ='[';
    if (forminfo.length>0){
      for (var i = 0; i < forminfo.length; i++) {
        if (i==0) {
          faultItems += '"' + forminfo[i] + '"';
        } else {
          faultItems += ',"' + forminfo[i] + '"';
        }
      }
    }
    faultItems = faultItems + ']';
    md5Key = "Xh207" + new Date().getDate() + new Date().getHours() +"cardNum="+cardNum+ "checkItems=" + checkItems + "comId=" + comId + "faultItems=" + faultItems +"govId="+govId+ "id=" + id  + "repairId=" + repairId + "userId=" + userId;
    md5Key = app.md5(md5Key);
  var formdata = { id: id, userId: userId,govId:govId,cardNum:cardNum, comId: comId, faultItems: forminfo, checkItems: dforminfo, mark: e.detail.value.mark, repairId: repairId, token: token, Key: md5Key};
    wx.request({
      url: app.globalData.murl +'/stove/front/equipment/wxSaveService',
      data: formdata,
      method: "POST",
      success(res) {
        if (200 == JSON.parse(res.data).code){
          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success:function(){
              wx.navigateBack({
                delta: 2
              });
            }
          });
        }
        if (400 == JSON.parse(res.data).code) {
          wx.hideLoading();
          wx.showToast({
            title: '请重试...',
            icon: 'none',
            duration: 3000,
          });
        }

      }, fail() {
        wx.hideLoading();
        wx.showToast({
          title: '请重试...',
          icon: 'none',
          duration: 2000,
        });
      },
      complete:function(){
        that.setData({
          disabled: false
        });
      }
    });
  }
})