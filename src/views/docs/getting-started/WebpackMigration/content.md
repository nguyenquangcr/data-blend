# Webpack 5 Migration From CRA

#### 1.Requirements

Before proceeding you'll need to have the latest stable [nodejs](https://nodejs.org/en/), [webpack5](https://webpack.js.org/)

#### 2.Install

Open the project folder and install package for migrating from [CRA](https://create-react-app.dev) to webpack5. You can use any package manager you want. We recommend [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com).

Install webpack and needed plugin

```sh
cd project-folder
yarn add -D webpack webpack-cli webpack-dev-server webpack-bundle-analyzer html-webpack-plugin mini-css-extract-plugin dotenv-webpack clean-webpack-plugin style-loader css-loader raw-loader react-dev-utils process file-loader fs stream-browserify browserify-zlib @pmmmwh/react-refresh-webpack-plugin
```

Install babel

```sh
yarn add -D @babel/core @babel/plugin-syntax-dynamic-import @babel/plugin-transform-runtime @babel/preset-react babel-eslint babel-loader babel-plugin-root-import babel-plugin-transform-imports
babel-preset-react-app
```

Create folder for webpack configuration

```sh
+-- build-utils
|   +-- addons
|       +-- webpack.bundleanalyze.js
+-- paths.js
+-- webpack.common.js
+-- webpack.config.js
+-- webpack.dev.js
+-- webpack.production.js
```

#### 3.Migration

Once the installation is done, and you create all the following folder above

In `build-utils/paths` where define all path we are using, copy the following code:

```sh
const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  // appIndexJs: resolveModule(resolveApp, 'src/index'),
  // testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  // proxySetup: resolveApp('src/setupProxy.js'),
  // swSrc: resolveModule(resolveApp, 'src/service-worker'),
  publicUrlOrPath
};
```

Next `build-utils/webpack.common.js` where define all configuration using in both development and production:

```sh
const path = require('path');
const paths = require('./paths');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.js'),
  output: {
    path: paths.appBuild,
    publicPath: '/'
  },
  target: 'web',
  devServer: {
    contentBase: paths.appBuild
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: paths.appSrc,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js'],
    modules: [paths.appSrc, 'node_modules'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      buffer: false,
      util: false,
      assert: false
    },
    alias: {
      '~': paths.appSrc
    }
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './src/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets/static',
          to: 'static'
        },
        {
          from: './src/assets/favicon',
          to: 'favicon'
        },
        {
          from: './src/assets/fonts',
          to: 'fonts'
        },
        {
          from: './src/assets/locales',
          to: 'locales'
        }
      ]
    })
  ]
};
```

CopyWebpackPlugin: copies individual files or entire directories, which already exist, to the build directory.
this plugin is needed when you move all folder `public/assets` to `src/assets`.
Below is just example how to implement it.

```sh
  plugins: [
    ...more plugin here,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets/static',
          to: 'static'
        },
        {
          from: './src/assets/favicon',
          to: 'favicon'
        },
        {
          from: './src/assets/fonts',
          to: 'fonts'
        },
        {
          from: './src/assets/locales',
          to: 'locales'
        }
      ]
    }),
  ]
```

Development configuration in `build-utils/webpack.dev.js`

```sh
const path = require('path');
const Dotenv = require('dotenv-webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '..', './.env')
    }),
    new ReactRefreshWebpackPlugin()
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    open: true,
    compress: true,
    hot: true
  },
  devtool: 'inline-source-map'
};
```

- [dotenv-webpack](https://www.npmjs.com/package/dotenv-webpack) allow you using env in webpack
- [@pmmmwh/react-refresh-webpack-plugin](https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin) helps you to hot-reload project with keeping state

Production configuration in `build-utils/webpack.prod.js`

```sh
const path = require('path');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
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
    }),
  ],
  devtool: 'source-map',
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
```

> The half way is done 👏

Add addon webpack `build-utils/addons/webpack.bundleanalyze.js`. Example with [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

```sh
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve(__dirname, '..', '..', './dist/report.html'),
      openAnalyzer: false
    })
  ]
};
```

Update `package.json`

```sh
  "scripts": {
    "lint": "eslint ./src",
    "start": "cross-env NODE_ENV=development webpack serve --config build-utils/webpack.config.js --env env=dev",
    "build": "cross-env NODE_ENV=production webpack --config build-utils/webpack.config.js --env env=prod",
    "build:analyze": "npm run build -- --env addon=bundleanalyze"
  },
```

#### 4.Clean up

Because react-scripts is still using webpack v4, so we need to remove it to avoid conflict webpack version

```sh
yarn remove react-scripts
```

#### 5.Start and build

Once the installation is done, you can now start your app by running `npm start` or `yarn start`.

Development

```sh
yarn start
```

This starts a local webserver at `http://localhost:3000` and auto detect file changes:

```sh
webpack 5.49.0 compiled successfully in 2643 ms
i ｢wdm｣: Compiled successfully.
```

Production

```sh
npm run build
```

or `yarn build`

Your app is ready to be deployed. 👏

#### 6.Webpack Module Federation

Before start thì step, you should take an overview about [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/) and [micro-frontend](https://micro-frontends.org/) mindset. Example [here](https://github.com/module-federation/module-federation-examples)

In `build-utils/webpack.prod.js` you config Module Federation like this to share your component

- Import ModuleFederationPlugin from `webpack/lib/container/ModuleFederationPlugin`

```sh
  const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
```

- Add ModuleFederationPlugin to plugins array

```sh
  plugins: [
      ...other plugins
      new ModuleFederationPlugin({
        name: 'insight',
        filename: 'remoteEntry.js',
        exposes: {
          './Routes': './src/routes'
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: deps.react
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom']
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: deps['react-router-dom']
          }
        }
      })
    ],
```

Plugin overview, more detail [here](https://webpack.js.org/concepts/module-federation/)
- **name**: Package name 
- **filename**: the name of bundle when you share it. Example currently your filename is `remoteEntry.js` so you can import to use it like `https://[your-domain]/remoteEntry.js`
- **exposes**: where defining which component you want to share
- **shared**: where defining shared libraries

> You will get some bugs but be strong and patience 👏
