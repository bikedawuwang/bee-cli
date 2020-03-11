/*
 * @Author: bikedawuwang
 * @Date: 2020-03-09 15:24:19
 * @LastEditors: bikedawuwang
 * @LastEditTime: 2020-03-09 15:24:19
 */

// @ts-nocheck
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const ora = require('ora');
const chalk = require('chalk');
const { isWindows } = require('./platform');
const { GITHUB_URL, WINDOWS_PACKAGE_MANAGER_SUFFIX, NPM, GITHUB_SERVER_URL } = require('../contants/template');
const templateConfig = require('../config/template');

let spinner;
const fsPromises = fs.promises;
const execAsync = util.promisify(exec);

function startInstallProcess(packageManager, projectName, appPath) {
  return new Promise((resolve) => {
    const pkgCmd = `${packageManager}${isWindows ? WINDOWS_PACKAGE_MANAGER_SUFFIX : ''}`;
    const installProcess = spawn(pkgCmd, ['install'], {
      stdio: 'inherit',
      cwd: appPath,
    });

    installProcess.on('close', () => {
      console.log(chalk.cyan('\nAll dependent packages installed successfully！\n'));
      console.log(`Now you can ${chalk.cyan(`cd ${appPath}`)} && Do your job!\n`);
      console.log(chalk.cyan('Enjoy coding.\n'));
      resolve();
    });
  });
}

async function handleRuleFiles(type, projectName, rootPath) {
  const ruleFile = path.resolve(rootPath, `eslint.${type}.js`);
  const eslintFile = path.resolve(rootPath, `.eslintrc.js`);

  const readStream = fs.createReadStream(ruleFile);
  const writeStream = fs.createWriteStream(eslintFile);

  readStream.pipe(writeStream);

  // 删除 eslint.*js 文件
  const files = await fsPromises.readdir(rootPath);
  for await (const file of files) {
    if (/eslint\./.test(file)) {
      await fsPromises.unlink(path.resolve(rootPath, file));
    }
  }
}

async function handleCurrentTypeDeps({ ruleType, packageManager, pkgCmd, appPath }) {
  const isNpm = packageManager === NPM;
  const action = isNpm ? 'install' : 'add';

  const pkgs = templateConfig[`${ruleType}Deps`];
  const installProcess = spawn(pkgCmd, [action, ...pkgs, '-D'], {
    stdio: 'inherit',
    cwd: appPath,
  });

  installProcess.on('close', () => {
    console.log(chalk.cyan(`\n ✌${ruleType}All related specification dependency packages are installed successfully!`));
  });
}

/**
 * 下载 GitHub 指定项目文件
 * @param {String} templateName 需要下载的模版项目名称
 * @param {String} projectName 新建项目的目录名称
 * @param {String} appPath 新建项目的目录路径
 * @param {String} packageManager 指定的包管理器 => ['npm', 'yarn']
 */
async function donwloadGithubFiles({ templateName, projectName, appPath, packageManager, ruleType }) {
  try {
    spinner = ora().start(`Creating new project! The current path is ${chalk.green(appPath)}`);
    let githubUrl = GITHUB_URL;
    if (templateName === 'Bumblebee' || templateName === 'Bumblebee-react') {
      githubUrl = GITHUB_SERVER_URL;
    }
    // 下载模板文件
    await execAsync(`git clone ${githubUrl}/${templateName} --depth=1 ${appPath}`);

    await spinner.stop();
    await spinner.succeed(`Directory created successfully! Current path is${chalk.green(`${appPath}\n`)}`);
    console.log(`Execute installation dependency package ${chalk.cyan(`${packageManager} install`)}，Please wait patiently...\n`);
    
    await execAsync(`rm -r -f ${appPath}/.git`);
    
    const pkgCmd = `${packageManager}${isWindows ? WINDOWS_PACKAGE_MANAGER_SUFFIX : ''}`;

    // 开启 install 子进程
    await startInstallProcess(packageManager, projectName, appPath);

    // 针对 project-starter 模板进行文件处理
    if (ruleType) {
      // 删除无关 rule 文件
      await handleRuleFiles(ruleType, projectName, appPath);

      // 增加对应 rule 依赖包
      await handleCurrentTypeDeps({ ruleType, packageManager, pkgCmd, projectName, appPath });
    }
  } catch (err) {
    spinner.stop();
    console.log(chalk.red(err.stack));
  }
}

module.exports = donwloadGithubFiles;
