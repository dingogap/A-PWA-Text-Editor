const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require("webpack-pwa-manifest");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

const path = require('path');
// const { GenerateSW } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = (env, argv) => {

  const injectManifest = new InjectManifest({
    swSrc: './src-sw.js',
    swDest: 'src-sw.js',
    ...(argv.mode !== 'production' ? { exclude: [/./] } : {}),
  });

  if (argv.mode !== 'production') {
    // In dev, suppress the "InjectManifest has been called multiple times" warning by reaching into
    // the private properties of the plugin and making sure it never ends up in the state
    // where it makes that warning.
    Object.defineProperty(injectManifest, 'alreadyCalled', {
      get() {
        return false;
      },
      set() {
        // do nothing; the internals try to set it to true, which then results in a warning
        // on the next run of webpack.
      },
    });
  }

  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'JATE',
      }),
      new MiniCssExtractPlugin(),
      
      // Injects our custom service worker
      injectManifest,

      // Creates a manifest.json file.
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'Contact Cards',
        short_name: 'Contact',
        description: 'Never forget your contacts!',
        background_color: '#225ca3',
        theme_color: '#225ca3',
        start_url: './',
        publicPath: './',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },       
      ],
    },
  };
}
