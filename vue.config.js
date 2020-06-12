const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'vue Admin Template' // page title

module.exports = {
  publicPath: "./", // 构建好的文件输出到哪里
  lintOnSave: false, // 使用带有浏览器内编译器的完整构建版本 // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  runtimeCompiler: false, // babel-loader默认会跳过`node_modules`依赖. // 通过这个选项可以显示转译一个依赖
  transpileDependencies: [
  ], 
  productionSourceMap: false, // 调整内部的webpack配置. // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  css: {
    extract: true, 
    sourceMap: false, 
    loaderOptions: {},
  	modules: false
  }, 
  parallel: require("os").cpus().length > 1, 
  pwa: {}, // configure webpack-dev-server behavior
  devServer: {
    open: process.platform === "darwin",
    disableHostCheck: false,
    host: "0.0.0.0",
    port: 80,
    https: false,
    hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: null // string | Object
  }, // 第三方插件配置

  pluginOptions: {
    // ...
  },
  configureWebpack: {                    // CSS 相关选项
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
  },
	chainWebpack(config) {
	    config.plugins.delete('preload') // TODO: need test
	    config.plugins.delete('prefetch') // TODO: need test
	
	    // set svg-sprite-loader
	    config.module
	      .rule('svg')
	      .exclude.add(resolve('src/icons'))
	      .end()
	    config.module
	      .rule('icons')
	      .test(/\.svg$/)
	      .include.add(resolve('src/icons'))
	      .end()
	      .use('svg-sprite-loader')
	      .loader('svg-sprite-loader')
	      .options({
	        symbolId: 'icon-[name]'
	      })
	      .end()
	    config.when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
      config.when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
	},
};
