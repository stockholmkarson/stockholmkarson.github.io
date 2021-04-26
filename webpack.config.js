const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: ["**/*", "!CNAME"],
    }),
    new HtmlWebpackPlugin({
      title: "Kärsön Disc Golf",
      favicon: "./src/resources/small_logo.png",
      hash: true,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      "process.env": JSON.stringify(""),
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "docs"),
    compress: true,
    port: 9000,
    historyApiFallback: true,
    hot: true,
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "docs"),
  },
};
