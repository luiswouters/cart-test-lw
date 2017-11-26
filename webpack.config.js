const webpack = require('webpack');
const nodeEnv = process.env.NODE_ENV || 'production';
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var sassLintPlugin = require('sasslint-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    filename: ['./app.js','./scss/main.scss']
  },
  output: {
    filename: '_build/bundle.js'
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", {
                "targets": {
                  "browsers": ["last 2 versions"]
                }
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [
          {
            loader: 'css-loader?importLoaders=1',
            options: {
              sourceMap: true
            }
          }]
        // publicPath: "/assets" // Overrides output.publicPath
        })
      },
      { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  plugins: [
    /*new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: true
    }),*/
    new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
    new ExtractTextPlugin({ // define where to save the file
      filename: 'dist/style.css',
      allChunks: true,
    }),
    new sassLintPlugin({
      glob: 'scss/**/*.s+(a|c)ss'
    })
  ]
};