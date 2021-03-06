// 通过分析 app.json 和 Page 配置文件中的 usingComponents 组件页面; 自动导入页面

const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
// const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");
const path = require("path");
const fs = require("fs");
const replaceExt = require("replace-ext");

function itemToPlugin(context, item, name) {
  return new SingleEntryPlugin(context, item, name);
}

function _findAllEntries(entries = [], dirname, entry) {
  const configFile = replaceExt(entry, ".json");
  const content = fs.readFileSync(configFile, "utf8");
  const config = JSON.parse(content);

  ["pages", "usingComponents"].forEach((key) => {
    const items = config[key];
    if (typeof items === "object") {
      Object.values(items).forEach((item) => {
        console.log(item, dirname);
        if (!/^@vant/.test(item)) {
          findAllEntries(entries, dirname, item);
        }
      });
    }
  });
}

function findAllEntries(entries, dirname, entry) {
  entry = path.resolve(dirname, entry);
  if (entry != null && !entries.includes(entry)) {
    entries.push(entry);
    _findAllEntries(entries, path.dirname(entry), entry);
  }
}

class WxPagesWebpackPlugin {
  constructor() {
    this.entries = [];
  }

  // apply 是每一个插件的入口
  apply(compiler) {
    const { context, entry } = compiler.options;
    const entryPath = entry?.main?.import?.[0] || "./app.js";
    // 找到所有的入口文件，存放在 entries 里面
    findAllEntries(this.entries, context, entryPath);

    // 这里订阅了 compiler 的 entryOption 事件，当事件发生时，就会执行回调里的代码
    compiler.hooks.entryOption.tap("WxPagesWebpackPlugin", () => {
      this.entries
        // 将文件的扩展名替换成 js
        .map((item) => replaceExt(item, ".js"))
        // 把绝对路径转换成相对于 context 的路径
        .map((item) => path.relative(context, item))
        // 应用每一个入口文件，就像手动配置的那样
        // 'app'              : './app.js',
        // 'pages/index/index': './pages/index/index.js',
        // 'pages/logs/logs'  : './pages/logs/logs.js',
        .forEach((item) => itemToPlugin(context, "./" + item, replaceExt(item, "")).apply(compiler));
      // 返回 true 告诉 webpack 内置插件就不要处理入口文件了，因为这里已经处理了
      return true;
    });
  }
}

module.exports = WxPagesWebpackPlugin;
