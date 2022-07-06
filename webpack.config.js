const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    'index': './src/index.js',
    'wheel': './src/wheel-of-random.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle-[name].js',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
}
