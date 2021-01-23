const merge                   = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin            = require('terser-webpack-plugin');
const common                  = require('./webpack.common.js');

module.exports = merge(common, {
   mode: 'production',
   optimization: {
   minimize : true,
      splitChunks:
          {
              cacheGroups: {
                  main: {
                      chunks: 'all',
                      name:
                          'site',
                      test:
                          'main',
                      enforce:
                          true
                  }
                  ,
                  vendors: {
                      chunks: 'all',
                      name:
                          'dependencies',
                      test:
                          'vendors',
                      enforce:
                          true
                  }
              }
          }
   },
   devtool: 'none',
   performance: {hints: false}
});