const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const express = require('express');

module.exports = ({ mode }) => {
  const isProduction = mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    target: 'web',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      assetModuleFilename: 'assets/[hash][ext][query]',
      clean: true,
      publicPath: '/',
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: {
      host: '0.0.0.0',
      allowedHosts: 'miemposvyat.ru',
      static: './dist',
      hot: true,
      port: 3000,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },
      devMiddleware: {
        writeToDisk: true,
      },
      setupMiddlewares: (middlewares, devServer) => {
        devServer.app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
        return middlewares;
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css',
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      !isProduction && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    module: {
      rules: [
        { test: /\.(html)$/, use: ['html-loader'] },
        {
          test: /\.(s[ac]|c)ss$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'resolve-url-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/img/[hash][ext][query]'
          }
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [
                !isProduction && require.resolve('react-refresh/babel')
              ].filter(Boolean),
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@helpers': path.resolve(__dirname, 'src/helpers'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@style': path.resolve(__dirname, 'src/scss'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      },
    },
  };
};