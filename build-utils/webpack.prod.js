const path = require('path');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('../package.json').dependencies;

module.exports = {
  mode: 'production',
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '..', './.env')
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
    // new ModuleFederationPlugin({
    //   name: 'insight',
    //   filename: 'remoteEntry.js',
    //   exposes: {
    //     './Routes': './src/routes'
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
  devtool: false,
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'node_vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        },
        svgGroup: {
          test(module) {
            // `module.resource` contains the absolute path of the file on disk.
            // Note the usage of `path.sep` instead of / or \, for cross-platform compatibility.
            const path = require('path');
            return (
              module.resource &&
              module.resource.endsWith('.svg') &&
              module.resource.includes(`${path.sep}cacheable_svgs${path.sep}`)
            );
          }
        },
        defaultVendors: {
          reuseExistingChunk: true,
          idHint: 'vendors'
        }
      }
    }
  }
};
