module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://localhost:7024',
        pathRewrite: {'^/api': '/api'},
        changeOrigin: true,
      },
    }
  }
}