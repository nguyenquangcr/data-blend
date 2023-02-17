const path = require('path');
const Dotenv = require('dotenv-webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('../package.json').dependencies;

module.exports = {
  mode: 'development',
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '..', './.env')
    }),
    new ReactRefreshWebpackPlugin()
    // new ModuleFederationPlugin({
    //   name: 'dmc',
    //   filename: 'remoteEntry.js',
    //   remotes: {
    //     data_integration:
    //       'data_integration@http://localhost:3001/remoteEntry.js',
    //     app2: 'app2@http://localhost:8080/remoteEntry.js'
    //   },
    //   shared: {
    //     react: {
    //       singleton: true,
    //       requiredVersion: deps.react
    //     },
    //     'react-dom': {
    //       singleton: true,
    //       requiredVersion: deps['react-dom']
    //     },
    //     'react-router-dom': {
    //       singleton: true,
    //       requiredVersion: deps['react-router-dom']
    //     }
    //   }
    // })
  ],
  devServer: {
    historyApiFallback: true,
    port: 3002,
    open: true,
    compress: true,
    hot: true,
    disableHostCheck: true
  },
  devtool: 'inline-source-map'
};
