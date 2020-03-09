/*
 * @Author: bikedawuwang
 * @Date: 2020-03-09 15:24:19
 * @LastEditors: bikedawuwang
 * @LastEditTime: 2020-03-09 15:24:19
 */

// @ts-nocheck
const fs = require('fs').promises;
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const questions = require('../../../prompt/template');
const donwloadGithubFiles = require('../../../utils/download-github-files');

module.exports = async function initTempalte() {
    const result = await inquirer.prompt(questions);
    const { projectName, templateName, packageManager, ruleType } = result;

    // 项目名为空则使用默认模版名称
    const appName = projectName || templateName;
    const appPath = path.resolve(appName);

    try {
        const stat = await fs.stat(appPath);
        if (stat.isDirectory()) {
            console.log(chalk.red('A directory with the same name exists in the current path\n'));
            console.log(chalk.red('Please rename the directory or delete the directory with the same name'));
        }
    } catch (err) {
        donwloadGithubFiles({
            templateName,
            projectName,
            appPath,
            packageManager,
            ruleType,
        });
    }
};
