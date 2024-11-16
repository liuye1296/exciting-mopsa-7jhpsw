import { defineConfig } from "@rsbuild/core";
const path = require("path");
import { pluginVue } from "@rsbuild/plugin-vue";
import { pluginStylus } from "@rsbuild/plugin-stylus";
const { VueLoaderPlugin } = require("vue-loader");

export default defineConfig({
  dev: {
    assetPrefix: "./",
  },

  html: {
    template: "./public/index.html",
  },

  server: {},

  source: {
    // 指定入口文件
    entry: {
      index: "./src/main.ts",
    },

    alias: {
      // '@': './src',
      antd: "ant-design-vue",
    },

    define: {
      // __APP_VERSION__: JSON.stringify(__APP_VERSION__),
      // __DEV__: JSON.stringify(__DEV__),
      // __PROD__: JSON.stringify(__PROD__),
      // __SERVER_PATH__: JSON.stringify(__SERVER_PATH__),
    },
  },

  plugins: [
    pluginVue(),
    pluginStylus({
      stylusOptions: {
        import: [path.join(__dirname, "./src/lib/stylus/vars.styl")],
      },
    }),
  ],

  tools: {
    // postcss: (config, { addPlugins }) => {
    //   addPlugins([require('@cola-js/postcss-flexbox'), require('autoprefixer')]);
    // },
    // postcss: {
    //   // 由于使用 `Object.assign` 合并，因此默认的 postcssOptions 会被覆盖。
    //   postcssOptions: {
    //     plugins: [require('@cola-js/postcss-flexbox'), require('autoprefixer')],
    //   },
    // },
    rspack: {
      plugins: [
        new VueLoaderPlugin(),
        // new rspack.DefinePlugin({
        //   NICE_FEATURE: JSON.stringify(true),
        //   EXPERIMENTAL_FEATURE: JSON.stringify(false),
        // })
      ],
      optimization: {
        // 模块名称被哈希为小的数字值
        moduleIds: "deterministic",
        // 计算真实hash值
        realContentHash: true,
        runtimeChunk: "single",
        splitChunks: {
          cacheGroups: {
            // 将其他 npm 模块抽离出来
            vendor: {
              chunks: "all",
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // antd 打包到独立文件
                if (
                  /(ant-design-vue|@ant-design[\\/])/.test(module?.resource!)
                ) {
                  return "antd";
                }
                // echarts 太大
                if (/zrender|echarts/.test(module?.resource!)) {
                  return "echarts";
                }
                // js基础第三方库，并用自身的包名来命名
                if (
                  /(jsbarcode|sortablejs|jsqr|cropperjs|js-pinyin|aes-js)/.test(
                    module?.resource!
                  )
                ) {
                  return RegExp.$1.replace("@", "");
                }
                // 把vue-i8n打包到独立文件
                if (/vue-i18n/.test(module?.resource!)) {
                  return "vue-i18n";
                }
                // sentry开头的 打包到独立文件
                if (/@sentry|@sentry[-/]/.test(module?.resource!)) {
                  return "sentry";
                }
                if (/tinymce/.test(module?.resource!)) {
                  return "tinymce";
                }
                return "vendor";
              },
              minSize: 0,
              priority: 10,
            },
            region: {
              chunks: "all",
              test: /[\\/]config[\\/]region/,
              name: "region-data",
            },
          },
        },
      },
    },
  },
});
