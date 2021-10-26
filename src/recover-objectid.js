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
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if ( typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value) ) {
        data[key] = new mongoose.Types.ObjectId(value);
      }
    });
    return data;
  };
}