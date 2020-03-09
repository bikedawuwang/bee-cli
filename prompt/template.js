/*
 * @Author: bikedawuwang
 * @Date: 2020-03-09 15:24:19
 * @LastEditors: bikedawuwang
 * @LastEditTime: 2020-03-09 15:24:19
 */

const { BEE_BOILERPLATE, PROJECT_STARTER } = require('../contants/template');

module.exports = [
  {
    name: 'packageManager',
    type: 'list',
    message: '请选择包管理器 (npm/yarn)',
    choices: ['yarn', 'npm'],
  },
  {
    name: 'templateName',
    type: 'list',
    message: '请选择模版项目！',
    choices: [BEE_BOILERPLATE, PROJECT_STARTER],
  },
  {
    name: 'projectName',
    type: 'input', 
    message: '请输入项目名称！',
  },
  {
    name: 'ruleType',
    type: 'list',
    choices: ['react', 'javascript'],
    when(input) {
      return input.templateName === PROJECT_STARTER;
    },
  },
];
