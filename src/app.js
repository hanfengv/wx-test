// app.js
import moment from "moment";
import { camelCase } from "lodash";
import coordtransform from "coordtransform";
function testNpm() {
  let sFromNowText = moment(new Date().getTime() - 360000).fromNow();
  console.log(sFromNowText);
  console.log(camelCase("OnLaunch"));
  console.log("🚀 :: coordtransform", coordtransform);
}

App({
  onLaunch() {
    testNpm();
    // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 登录
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
  },
  globalData: {
    userInfo: null,
  },
});
