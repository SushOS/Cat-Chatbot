// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//     entry: './src/index.tsx',
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'bundle.js',
//     },
//     resolve: {
//         extensions: ['.ts', '.tsx', '.js', '.jsx'],
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.(ts|tsx)$/,
//                 exclude: /node_modules/,
//                 use: 'babel-loader',
//             },
//             {
//                 test: /\.css$/,
//                 use: ['style-loader', 'css-loader'],
//             },
//         ],
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: './public/index.html',
//         }),
//     ],
//     devServer: {
//         port: 3000,
//         hot: true,
//         open: true,
//     },
// }; 

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
};