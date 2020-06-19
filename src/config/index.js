var path = require("path");

// 将此模块下的东西进行导出
module.exports = {
	// 下面是build也就是生产编译环境下的一些配置-----------------生产环境!!!!
    build: {
    	// 这个是我项目中一个文件,意味将其导入
        sitEnv: require("./dev.env"),
        // 导入此文件,这个文件用来指向当前开发的环境
        prodEnv: require("./prod.env"),
        // __dirname 总是指向被执行 js 文件的绝对路径 
        // 这个是相对路径的拼接,当前根目录为 config 而下面的属性值就是 dist/index.html
        index: path.resolve(__dirname, "../dist/index.html"),
        // 下面定义的是静态资源的根目录, 也就是打包之后的dist文件
        assetsRoot: path.resolve(__dirname, "../dist"),
        // assetsSubDirectory意为 资产子目录 也就是静态资源根目录的子目录 static ,在dist文件下面
        assetsSubDirectory: "static",
         // 请根据自己路径配置更改 线上发布的时候一般都会使用nginx反向代理，所以使用./是最靠谱的，但是vue-cli dev 中的 assetsPublicPath不能配置成"./",而build中的却可以配置，并可以正常访问，虽然不影响发布但是影响开发效率。
        assetsPublicPath: "./",
        // 下面定义是否生成生产环境的sourcmap，sourcmap是用来debug编译后文件的，通过映射到编译前文件来实现
        // 将其改为 true 之后 项目打包之后 在 dist文件中会出现很多 .map文件, [详看这个地址](https://blog.csdn.net/weixin_43553701/article/details/91804515)
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        // 上面有因为注释 意为: 是否在生产环境中压缩代码,如果需要压缩, 就要安装 compression-webpack-plugin 这个插件
        productionGzip: false,
        // 这个接受一个数组,单个参数也是可以的,定义要压缩的那些文件
        productionGzipExtensions: ["js", "css"],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        // 上有英文注释
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
    	// 导入模块,用来指明开发环境
        env: require("./dev.env"),
        // 这是 本地项目启用的时候监听的端口号 可自行修改
        port: 9527,
        // 项目启动的时候自行打开浏览器  接受一个 布尔值
        autoOpenBrowser: true,
        assetsSubDirectory: "static",
        assetsPublicPath: "/",
        // 下面是代理表，作用是用来，建一个虚拟api服务器用来代理本机的请求，只能用于开发模式
        proxyTable: {
            "/jwt": {
                target: "http://192.168.2.252:8082",
                pathRewrite: {
                    "^/jwt": "/jwt"
                }
            },
            "/admin": {
                // target: "http://wwww.baidu.com",
                target: "123",
                pathRewrite: {
                    "^/api": "/api"
                }
            },
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
};