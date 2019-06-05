const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'user': './src/user.js'
  },
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'js/[name].min.js'
  },
  resolve: {
    extensions: ['.less', '.js', '.css', '.html'],
    modules: [
      path.resolve('./'),
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader"
        ]
      },
      {
        test: /\.(jpg|gif|png|svg)$/,
        use: {
          loader: 'url-loader'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].min.css'
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        },
        autoprefixer: false
      },
      canPrint: true
    }),
    new HtmlWebpackPlugin({
      title: 'User View',
      chunks: ['user'],
      template: './src/user.html',
      filename: './users/view/index.html'
    })
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin({
      include: /\.min\.js$/
    })]
  },
  devServer: {
    hot: true,
    contentBase: './public',
    port: 3333,
    openPage: '/users/view',
    proxy: {
      '/**': {
        target: 'http://localhost:3000',
        pathRewrite: { '^': '' },
        secure: false,
        changeOrigin: false
      }
    }
  }
}
