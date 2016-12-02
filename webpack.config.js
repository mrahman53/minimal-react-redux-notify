const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const env = process.env.NODE_ENV;

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

const reduxExternal = {
  root: 'Redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux',
};

const reactReduxExternal = {
  root: 'ReactRedux',
  commonjs2: 'react-redux',
  commonjs: 'react-redux',
  amd: 'react-redux',
};

const ReactPureRenderMixinExternal = {
  root: ['React', 'addons', 'PureRenderMixin'],
  commonjs2: 'react-addons-pure-render-mixin',
  commonjs: 'react-addons-pure-render-mixin',
  amd: 'react-addons-pure-render-mixin',
};

const config = {
  externals: {
    react: reactExternal,
    redux: reduxExternal,
    'react-redux': reactReduxExternal,
    'react-addons-pure-render-mixin': ReactPureRenderMixinExternal,
  },
  resolve: {
    root: [
      path.resolve('./src'),
    ],
    modules: [
      './node_modules',
      path.resolve(__dirname, 'src'),
    ],
  },
  output: {
    library: 'ReactReduxNotify',
    libraryTarget: (env !== 'lib') ? 'umd' : 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime', 'transform-class-properties', 'transform-es2015-destructuring', 'transform-object-rest-spread'],
          presets: ['es2015', 'react'],
          env: {
            production: {
              plugins: ['transform-react-remove-prop-types'],
            },
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    new webpack.optimize.DedupePlugin(),
  ],
};

if (env === 'production') {
  config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
          },
        })
    );
  config.plugins.push(
        new ExtractTextPlugin('ReactReduxNotify.min.css')
    );
}

module.exports = config;
