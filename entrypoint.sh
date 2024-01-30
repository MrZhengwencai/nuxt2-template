#!/bin/bash
#pm2启动前的自定义脚本
#如果你使用了 npm install -g安装全局的npm包并且在接下来的自定义脚本中使用相关命令请在安装模块的指令（npm install -g ...）后添加
#ln -sfb /usr/local/src/node-v${NODE_VERSION}-linux-x64/bin/* /usr/local/bin/
#该命令用于使模块命令全局可调用
#应用目录位于/app目录下，开始你的自定义shell之路
cd /app
npm run build
