const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    app: "./app.js",
    "pages/index/index": "./pages/index/index.js",
    "pages/logs/logs": "./pages/logs/logs.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          // options: { // 配置项 移动到 .babelrc 文件
          //   presets: ["@babel/preset-env"],
          // },
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          // fast-glob 语法; 匹配src目录（任何嵌套级别）中的所有文件 https://github.com/mrmlnc/fast-glob#pattern-syntax
          from: "**/*",
          to: "./",
          globOptions: {
            gitignore: true,
            ignore: ["**/*.less", "**/*.js"],
          },
        },
      ],
    }),
  ],
  mode: "none",
};
