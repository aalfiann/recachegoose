'use strict';

const ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (mongoose, cachedResults) {
  if (Array.isArray(cachedResults)) {
    const l = cachedResults.length;

    for (let i = 0; i < l; i++) {
      cachedResults[i] = recoverObjectId(mongoose)(cachedResults[i]);
    }
  }

  return recoverObjectId(mongoose)(cachedResults);
};

function isValidObjectId(id) {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

function recoverObjectId(mongoose) {
  return data => {
    if (!isValidObjectId(data._id)) {
      return data;
    }

    data._id = new ObjectId(data._id);
    return data;
  };
}