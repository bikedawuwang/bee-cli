#!/usr/bin/env node

const program = require('commander');
const initTemplate = require('../packages/init-template/lib');
const { version } = require('../package.json');
// const deployStatic = require('../packages/deploy-static/lib');

node 
    .version(version, '-v, --version')
    .description('-i, --init 生成指定的模板 （目前只有 react + typescript）')
    .usage('<command> [option]')
    .option('-i, --init', '生成指定的模板 （目前只有 react + typescript）', initTemplate)
    // FEATURE: 增加部署静态资源到服务器功能
    // .option('-d, --deploy', '部署静态资源到服务器，自动执行文件拷贝')
    .parse(process.argv); // 将Program写入到命令行

process.on('unhandledRejection', (err) => {
    throw err;
});
