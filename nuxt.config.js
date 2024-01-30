
const {
  SITE_TITLE,
  DESCRIPTION,
  KEY_WORDS,
} = require("./config/constants");
const PATH_TYPE = process.env.PATH_TYPE || "prod";
console.log("nuxt.config.js", PATH_TYPE);
const {
  mallPath,
  actPath,
  zhiai_domain,
  OSS_BUCKETNAME,
} = require(`./config/${PATH_TYPE}.env.config`);
// 去除console日志
let remove_console = []
if (PATH_TYPE === 'prod') {
  remove_console.push("transform-remove-console")
}
module.exports = {
  telemetry: false,
  head: {
    htmlAttrs: {
      lang: "zh-CN",
    },
    title: SITE_TITLE,
    meta: [
      {
        hid: "description",
        name: "description",
        content: DESCRIPTION,
      },
      {
        hid: "keywords",
        name: "keywords",
        content: KEY_WORDS,
      },
      { name: 'renderer', content: 'webkit' },
      { name: 'force-rendering', content: 'webkit' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=Edge,chrome=1' },
      { name: 'baidu-site-verification', content: 'mREHhDF8nW' },
      /*以上是设置双核浏览器默认状态下使用极速模式打开*/
      { charset: 'utf-8' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' },

      /*新增搜狗、神马、360 */
      { name: '360-site-verification', content: '850970beabd63bd397272b6dd73a1aba' },
      { name: 'sogou_site_verification', content: 'y3fi8ttkxP' },
      { name: 'shenma-site-verification', content: '15230d9dfb2e66bfecf2408862f2462c_1537497601' }
    ],
    // 资源 CDN 域名
    // 分析这个页面需要的资源所在的域名，浏览器空闲时提前将这些域名转化为 IP 地址，真正请求资源时就避免了上述这个过程的时间
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: "dns-prefetch",
        href: `//zashop-mini.i72.com`,
      },
    ],

    script: [],
  },

  css: [
    '~assets/css/reset.css',
    "assets/css/main.scss",
    "swiper/dist/css/swiper.css",
    "viewerjs/dist/viewer.css",
    "animate.css/animate.css"
  ],

  loading: { color: '#FFFFFF' },

  /*
  ** 使用了npm包以及指令什么的都要在plugins配置项配置相关文件路径
  */
  plugins: [
    { src: "~/plugins/http/axios" },
    { src: "~/plugins/http/api-plugin" },
    { src: '~/plugins/image-lazyload/vue-lazyload', ssr: false },
    { src: "~/plugins/element-ui/element-ui" },
    { src: "~/plugins/swiper/vue-awesome-swiper", ssr: false },
    { src: "~/plugins/clipboard/vue-clipboard", ssr: false },
    { src: "~/plugins/viewer/vue-viewer", ssr: false },
    { src: "~/plugins/errorBoundary/monitoring" },
    { src: "~/plugins/route/index", ssr: false },
    { src: "~/plugins/setDocumentTitle/index", ssr: false },
    // { src: "~/plugins/vconsole/index", ssr: false }
  ],

  /*
  ** 使用npm run generate打包静态页面修改相对路径需使用，使用npm run build打包或者npm run dev启动不需要配置这个
  */
  router: {
    // base: '/',
    middleware: ['device'],
  },

  build: {
    // 分析并可视化构建后的打包文件
    // 可通过 nuxt build --analyze 或 nuxt build -a 命令来启用该分析器进行编译构建，分析结果可在 http://localhost:8888 上查看
    // analyze: true,

    // 使用插件 babel-plugin-component,减少vendors.app.js的大小
    // 按需引入element- ui
    babel: {
      plugins: [
        ["component", { "libraryName": "element-ui", "styleLibraryName": "theme-chalk" }],
        ...remove_console
      ]
    },
    /**
     * 将查看源代码中的css采用外部引入方式
     */
    extractCSS: {
      allChunks: true,
      ignoreOrder: true,// 禁用顺序检查
    },

    /**
     * 配置防止多次打包
     * 起到tree-shaking去除无用代码
     */
    vender: ['axios', 'vue-lazyload'],
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, Client }) {
      if (isDev && Client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  //设置缓存
  cache: true,

  //禁止预加载效果(false:禁止预加载)
  performance: {
    prefetch: false
  },

  modules: [
    // 'nuxt-robots-module',
    // '@nuxtjs/sitemap',
    '@nuxtjs/axios',
  ],

  /*
  ** 配置接口网关路径(环境变量)
  */
  env: {
    PATH_TYPE: process.env.PATH_TYPE,
    NODE_ENV: process.env.NODE_ENV,
    MALL_PATH: mallPath,
    ACT_PATH: actPath,
    ZHIAI_DOMAIN: zhiai_domain,
    OSS_BUCKETNAME: OSS_BUCKETNAME,
  },

  //添加robots.txt文件，可以使用插件方法也可以直接在static文件夹中放入robots.txt都可以访问到
  // 'nuxt-robots-module': {
  //   UserAgent: '*',
  //   Disallow: '/',
  //   Sitemap: 'http://www.visney.cn/sitemap.xml'
  // },

  // sitemap: {
  //   cacheTime: 1000 * 60 * 60 * 24,
  //   gzip: false,
  //   generate: true,
  //   routes() {
  //     return axios.get('http://visney.cn:81/product/selectAllIds')
  //       .then(res => res.data.map(
  //         prodView => '/prod/pdV/' + prodView.id + '?typeId=' + prodView.typeId + '&classId=' + prodView.classId
  //       ))
  //     // axios.get('http://visney.cn:81/article/selectAllIds')
  //     // .then(res => res.data.map(
  //     //   newsView => '/news/newsView/' + newsView.articleId + '?category=' + newsView.category
  //     // ))
  //   }
  // }
}
