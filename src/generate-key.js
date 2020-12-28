'use strict';

const sha1 = require('sha1');

function jsosort(obj, sortfunction) {
  const result = {};
  const key = Object.keys(obj).sort(sortfunction);
  const keylength = key.length;
  for (let i = 0; i < keylength; i++) {
    let value = obj[key[i]];
    if (Object.prototype.toString.call(value) === '[object Object]') {
      value = jsosort(value, sortfunction);
    }
    result[key[i]] = value;
  }
  return result;
}

module.exports = function init(obj) {
  obj = jsosort(obj);
  obj = JSON.stringify(obj, (key, val) => {
    return val instanceof RegExp ? String(val) : val;
  });

  return sha1(obj);
};
