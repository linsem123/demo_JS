```
const PurifyCSS = require("purifycss-webpack");
const glob = require("glob-all");

let purifyCSS = new PurifyCSS({
  paths: glob.sync([
    // 要做CSS Tree Shaking的路径文件
    path.resolve(__dirname, "./*.html"),
    path.resolve(__dirname, "./src/*.js")
  ])
});
module.exports = {
	entry:{
		app:"./"
	},
	output:{
		filename:"",
		path:path.resolve(__dirname,"dist"),
		publicpath:""
	},
	module:{
		rules:[{
			test:/\.js$/,
			exclude:/node_modules/,
			use:"babel-loader"
		},
		{
	        test: /\.css$/, // 针对CSS结尾的文件设置LOADER
	        use: [
	          {
	            loader: "style-loader",
	            options: {
	              singleton: true // 处理为单个style标签
	            }
	          },
	          {
	            loader: "css-loader",
	            options: {
	              minimize: true // css代码压缩
	            }
	          }
	        ]
      }]
	},
	aptimization:{
		splitChunks:{
			cacheGroups:{
				vendor:{
					name:"vender",
					test:/[\\/]node_modules[\\/]/,
					chunks:"all",
					priority:10
				},
				common:{
					name:"common",
					test://,
					chunks:"all",
					minSize:1,
					minChunks:2,
					priority:0
				}
			}
		}
	},
	plugins:[purifyCSS]
}
```