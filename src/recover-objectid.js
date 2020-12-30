'use strict';

module.exports = function(mongoose, cachedResults) {
  if (Array.isArray(cachedResults)) {
    const l = cachedResults.length;
    for (let i = 0; i < l; i++) {
      cachedResults[i] = recoverObjectId(mongoose)(cachedResults[i]);
    }
  }
  return recoverObjectId(mongoose)(cachedResults);
};

function recoverObjectId(mongoose) {
  return (data) => {
    if (!data._id) {
      return data;
    }

    data._id = new mongoose.Types.ObjectId(data._id);
    return data;
  };
}