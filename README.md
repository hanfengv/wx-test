# 小程序 webpack5 工程化

## 创建一个小程序项目

创建一个 src 目录并将下面的文件移动到 src 下

`app.js app.json app.wxss components pages sitemap.json utils`

## 安装 webpack

```shell
npm init -y
npm install webpack webpack-cli --save-dev

npm install copy-webpack-plugin --save-dev
```

## 配置 webpack

```js
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        // fast-glob 语法; 匹配src目录（任何嵌套级别）中的所有文件 https://github.com/mrmlnc/fast-glob#pattern-syntax
        from: "**/*",
        to: "./",
      },
    ]),
  ],
  mode: "none",
};
```

## 配置开发者工具小程序入口

```js
// project.config.json
{
  "description": "项目配置文件",
  "miniprogramRoot": "dist/",
}
```

## 运行成功

```js
npx webpack
```

上面的步骤作用:

1. 将 src 中的文件复制到 dist;
2. src/app.js -> dist/main.js
3. 让微信开发者工具知道, dist 才是我们要发布的代码

## 使用 webpack 解决 npm 的依赖问题

[参考 babel-loader](https://webpack.docschina.org/loaders/babel-loader/)

```js
npm i moment lodash
// 使用 babel-loader 处理 js 依赖问题
npm install -D babel-loader @babel/core @babel/preset-env webpack
```
