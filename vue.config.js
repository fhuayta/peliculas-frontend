const git = require('child_process');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const date = (new Date()).toLocaleString();
let gitVersion = '';
try {
  gitVersion = (
    git.execSync('git describe --always').toString().replace(/[\s\r\n]+$/, '')
  );
} catch {
  gitVersion = '0000000';
}

const URL_PROXY = process.env.VUE_APP_BASE_SERVER;
module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'src/index.html',
      meta: {
        rversion: `C${gitVersion}B`,
        cdate: `${date}`
      },
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  devServer: {
    host: 'localhost',
    proxy: {
      '^/ciudadania-callback': {
        target: URL_PROXY,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['*', '.js', '.vue', '.json']
    },
    performance: {
      hints: false
    },
    module: {
      rules: [
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              }
            },
          ],
          type: 'javascript/auto'
        },
      ],
    },
    optimization: {
      minimizer: [
        new ImageMinimizerPlugin({
          minimizerOptions: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ['optipng', { optimizationLevel: 5 }],
              ],
            },
          },
        })
      ]
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
    ],
    devtool:
      process.env.NODE_ENV === 'production' ? false : 'eval-cheap-module-source-map',
    devServer: {
      watchOptions: {
        ignored: [/node_modules/, /tests/, /\.png|\.jpg|\.svg|\.ico|\.ttf$/],
      },
    },
  },
  filenameHashing: process.env.NODE_ENV === 'production',
  transpileDependencies: ['vuetify'],
  // assetsDir: 'assets',
  publicPath: process.env.VUE_APP_PUBLIC_PATH, // Si tiene un subdominio colocar /tu_subdominio/
  lintOnSave: true,
  productionSourceMap: false
};
