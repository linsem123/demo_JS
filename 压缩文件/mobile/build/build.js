"use strict";
require("./check-versions")();

process.env.NODE_ENV = "production";

const ora = require("ora");
const rm = require("rimraf");
const path = require("path");
const chalk = require("chalk");
const merge = require('webpack-merge')
const webpack = require("webpack");
const config = require("../config");
const webpackConfig = require("./webpack.prod.conf");

const {appConfig, ctxEnvConfig} = require("./app.conf");

const child_process = require("child_process");
const fs = require("fs");

if(!process.argv[2]) {
  console.log("缺少打包环境参数")
  return;
}

if(process.argv[2] != 'dev' && process.argv[2] != 'test' && process.argv[2] != 'vnet'  &&  process.argv[2] != 'prod' ){
  console.log("错误的打包环境参数")
  return;
}

let ctxEnv = process.argv[2];

const {PFC_CODE, hcp_config, ctx_config} = ctxEnvConfig[ctxEnv];

fs.writeFile(path.resolve(__dirname, "../cordova-hcp.json"), 
`
${JSON.stringify(hcp_config)}
`, function(err) {
  if (err) {
    console.error(err);
  } else {
    // console.log('写入成功');
  }
});

fs.writeFile(path.resolve(__dirname, "../src/config/appconfig.js"), 
`
"use strict";
module.exports = ${JSON.stringify(merge(appConfig, ctx_config, {PFC_CODE: PFC_CODE}, {debug:false, env:ctxEnv}))};
`, function(err) {
  if (err) {
    console.error(err);
  } else {
    // console.log('写入成功');
  }
});



// const router_conf = path.resolve(__dirname, "../src/router/index.js"); //修改router

/**路由配置 */
// if(process.argv[3] && process.argv[3] == 'audit'){
//   fs.readFile(path.resolve(__dirname, "../src/router/index.audit.js"), (err, data) => {
//     if (err) throw err;
//     fs.writeFile(router_conf,data,function (err) {
//        if(err) {
//           console.error(err);
//         } else {
//           // console.log('写入成功');
//         }
//     });
//   });
// }else{
//   fs.readFile(path.resolve(__dirname, "../src/router/index.full.js"), (err, data) => {
//     if (err) throw err;
//     // console.log(data);
//     fs.writeFile(router_conf,data,function (err) {
//        if(err) {
//           console.error(err);
//         } else {
//           // console.log('写入成功');
//         }
//     });
//   });
// }



const spinner = ora(`building for ${ctxEnv}...`);
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err;
  webpack(webpackConfig, function(err, stats) {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + "\n\n"
    );

    if (stats.hasErrors()) {
      console.log(chalk.red("  Build failed with errors.\n"));
      process.exit(1);
    }


    var spawnObj = child_process.spawn("cordova-hcp", ["build", "dist"]);
    spawnObj.stdout.on("data", function(chunk) {
      console.log(chunk.toString());
    });
    spawnObj.stderr.on("data", data => {
      console.log(data);
    });
    spawnObj.on("close", function(code) {
      console.log(chalk.cyan("  Build complete.\n"));
    });
  });
});
