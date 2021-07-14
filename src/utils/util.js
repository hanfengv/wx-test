export const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[hour, minute, second].map(formatNumber).join(":")}`;
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

/**
 * 返回两个数相加
 * @param {number} a
 * @param {number} b
 * @returns {number} 和
 */
export const add = (a, b) => {
  return { name: "小红" };
};

/**
 * @typedef UserInfo
 * @desc 用户信息
 * @property {boolean} isServer - 是否未服务者
 * @property {string} name - 姓名
 * @property {number} age - 年龄
 * @property {boolean} isAdmin - 是否是管理员
 */

/**
 * @param {boolean} isServer
 * @returns {UserInfo}
 */
export const getUserInfo = (isServer = false) => {
  return {
    isServer,
    name: "小明",
    age: 18,
    isAdmin: false,
  };
};
