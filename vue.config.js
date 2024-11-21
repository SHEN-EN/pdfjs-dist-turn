const { defineConfig } = require('@vue/cli-service')

const webpack = require('webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:config=>{
    config.plugins.push(new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    }))
    config.module.rules.push({
      test: /\.pdf$/,
      use: [
        {
          loader: 'file-loader',
          options: {},
        },
      ],
    })
  }

})
