'use strict';
let TEMP = process.argv.splice(2)[0] || 'prod';
let PATH = '';
let FRONT = '';
if (TEMP === 'dev') {
  PATH = '/evercos3';
  FRONT = '/html3';
} else if (TEMP === 'sit') {
  PATH = '/evercos2';
  FRONT = '/html2';
} else if (TEMP === 'uat') {
  PATH = '/evercos';
  FRONT = '/html';
} else if (TEMP === 'prod') {
  PATH = '/evercos';
  FRONT = '/html';
} else {
  PATH = '/evercos';
  FRONT = '/html';
}
module.exports = {
  NODE_ENV: '"production"',
  PATH: '"' + PATH + '"',
  FRONT:'"' + FRONT + '"'
};
