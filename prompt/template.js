/*
 * @Author: bikedawuwang
 * @Date: 2020-03-09 15:24:19
 * @LastEditors: bikedawuwang
 * @LastEditTime: 2020-03-09 15:24:19
 */

const { BEE_BOILERPLATE, BUMBLEBEE, BUMBLEBEE_REACT} = require('../contants/template');

module.exports = [
  {
    name: 'packageManager',
    type: 'list',
    message: 'Please select package manager (npm/yarn)',
    choices: ['yarn', 'npm'],
  },
  {
    name: 'templateName',
    type: 'list',
    message: 'Please select template item: ',
    choices: [BEE_BOILERPLATE, BUMBLEBEE, BUMBLEBEE_REACT],
  },
  {
    name: 'projectName',
    type: 'input', 
    message: 'Please enter project name: ',
  },
  {
    name: 'ruleType',
    type: 'list',
    message: 'Please select eslint: ',
    choices: ['react', 'javascript'],
  },
];
