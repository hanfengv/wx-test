const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WxPagesWatchWebpackPlugin = require("./plugin/WxPagesWatchWebpackPlugin");
const MinaRuntimePlugin = require("./plugin/MinaRuntimePlugin");

const nodeModulesPath = (pathName = "") => path.resolve(__dirname, `node_modules/${pathName}`);

const Px2rpx = require("@megalo/px2rpx");
const px2rpxIns = new Px2rpx({ rpxUnit: 0.5 });

module.exports = {
  context: path.resolve(__dirname, "src"),
  // entry: {
  //   app: "./app.js",
  //   "pages/index/index": "./pages/index/index.js",
  //   "pages/logs/logs": "./pages/logs/logs.js",
  //   "components/search-bar/search-bar": "./components/search-bar/search-bar.js",
  //   "components/test-component/test-component": "./components/test-component/test-component.js",
  // },
  entry: "./app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
    globalObject: "wx",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
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
            ignore: ["**/*.less", "**/*.js"],
          },
          transform(content, absoluteFrom) {
            if (absoluteFrom.endsWith(".wxss")) {
              return px2rpxIns.generateRpx(content.toString(), 1);
            }
            return content;
          },
        },
      ],
    }),
    // 拷贝 vant-ui
    new CopyWebpackPlugin({
      patterns: [
        {
          from: nodeModulesPath("@vant/weapp/dist"),
          to: "./@vant/weapp",
          globOptions: {
            ignore: ["**/*.ts"],
          },
          transform(content, absoluteFrom) {
            if (absoluteFrom.endsWith(".wxss")) {
              return px2rpxIns.generateRpx(content.toString(), 1);
            }
            return content;
          },
        },
      ],
    }),
    new WxPagesWatchWebpackPlugin(),
    new MinaRuntimePlugin(),
  ],
  mode: "none",
  optimization: {
    usedExports: true, // Tree Shaking
    runtimeChunk: {
      // 拆分 runtime
      name: "runtime",
    },
    splitChunks: {
      // 拆分共享代码块
      chunks: "all",
      name: "common",
      minChunks: 2,
      minSize: 0,
    },
  },
};
