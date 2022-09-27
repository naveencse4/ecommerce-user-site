const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'production',
	entry: {
		main: ['./src/client/index.js']
	},
	output: {
		path: path.join(__dirname, '/dist/'),
		filename: './[name].bundle.js'
	},
	module: {
		rules: [
		{
			test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
			loader: "file-loader",
			options: {
				name: "public/images/[name].[ext]",
				publicPath: url => url.replace(/public/, "")
			}
		}, {
			test: /\.js$/,
			exclude: /node_modules/,
			use: 'babel-loader'
		}, {
			test: /\.css$/,
			use: [{
				loader: MiniCssExtractPlugin.loader
			}, {
				loader: 'css-loader',
				options: {
					sourceMap: true,
					modules: true,
					// localIdentName: '[name]__[local]___[hash:base64:5]'
					localIdentName: '[local]'
				}
			}]
		}, {
			test: /\.scss$/,
			use: [{
				loader: MiniCssExtractPlugin.loader
			}, {
				loader: 'css-loader',
				options: {
					sourceMap: true,
					modules: true,
					// localIdentName: '[name]__[local]___[hash:base64:5]'
					localIdentName: '[local]'
				}
			},
				'sass-loader'
			]
		}
		]
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
		runtimeChunk: true,
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].style.css'
		})
	]
};
