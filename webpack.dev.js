const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
    devtool: "devtool: 'source-map'",
    mode: "development",
    entry: ["babel-polyfill", "./src/index.js"],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', 'html']
    },
    devServer: {
		historyApiFallback: true,
        // https: true,
        contentBase:"./public",
		port: "8082",
	},
    module: {
      rules: [
        {
          test: /\.(js|jsx|mjs|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/react", "@babel/env"]
            }
          }
        },
        {
            test: /\.html$/,
            use: [
              {
                loader: "html-loader"
              }
            ]
        },
        {
          test: /\.less$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                camelCase: "only",
                importLoaders: 2,
                localIdentName: "[local]--[hash:base64:5]"
              }
            },
            "less-loader"
          ]
        },
        {
          test: /\.(eot|woff|woff2|ttf|gif|png|jpe?g|svg|webp|m4v|webm|mp4)$/i,
          use: [
            "file-loader",
            {
              loader: "image-webpack-loader",
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer
                outputPath: "images/"
              }
            }
          ]
        }
      ]
    },
    plugins: [
        new HtmlWebPackPlugin({
          template: "public/index.html",
          filename: "index.html",

        }),
    ]
  };