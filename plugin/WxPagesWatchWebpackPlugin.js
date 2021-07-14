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

class WxPagesWatchWebpackPlugin {
  constructor() {
    this.entries = [];
  }

  applyEntry(compiler, done) {
    const { context } = compiler.options;
    this.entries
      .map((item) => replaceExt(item, ".js"))
      .map((item) => path.relative(context, item))
      .forEach((item) => itemToPlugin(context, "./" + item, replaceExt(item, "")).apply(compiler));
    if (done) {
      done();
    }
  }

  apply(compiler) {
    const { context, entry } = compiler.options;
    const entryPath = entry?.main?.import?.[0] || "./app.js";
    findAllEntries(this.entries, context, entryPath);

    compiler.hooks.entryOption.tap("WxPagesWatchWebpackPlugin", () => {
      this.applyEntry(compiler);
      return true;
    });

    // 监听 watchRun 事件
    compiler.hooks.watchRun.tap("WxPagesWatchWebpackPlugin", (compiler, done) => {
      this.applyEntry(compiler, done);
    });
  }
}

module.exports = WxPagesWatchWebpackPlugin;
