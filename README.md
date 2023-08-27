> This is a fork version of [cachegoose](https://github.com/boblauer/cachegoose) with following differences :
- Minimum NodeJS 14
- Removed old libraries
- Fixing all vulnerables
- Up to date
- Typescript [support](https://github.com/xrip/cachegoose)
- Replace [cacheman](https://github.com/cayasso/cacheman) with [recacheman](https://github.com/aalfiann/recacheman)

# recachegoose #

#### Mongoose caching that actually works. ####

[![NPM](https://nodei.co/npm/recachegoose.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/recachegoose/)  
  
[![npm version](https://img.shields.io/npm/v/recachegoose.svg?style=flat-square)](https://www.npmjs.org/package/recachegoose)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/aalfiann/recachegoose/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/aalfiann/recachegoose/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/aalfiann/recachegoose/badge.svg?branch=master)](https://coveralls.io/github/aalfiann/recachegoose?branch=master)
[![Known Vulnerabilities](https://snyk.io//test/github/aalfiann/recachegoose/badge.svg?targetFile=package.json)](https://snyk.io//test/github/aalfiann/recachegoose?targetFile=package.json)
![License](https://img.shields.io/npm/l/recachegoose)
![NPM download/month](https://img.shields.io/npm/dm/recachegoose.svg)
![NPM download total](https://img.shields.io/npm/dt/recachegoose.svg)  

## About ##

A Mongoose caching module that works exactly how you would expect it to, with the latest version of Mongoose.

> Important:  
  If you are using Mongoose 4.x or below, you have to use original [cachegoose](https://github.com/boblauer/cachegoose) and use version <= 4.x of it.



## Usage ##

- Use In Memory
```javascript
var mongoose = require('mongoose');
var cachegoose = require('recachegoose');

cachegoose(mongoose, {
  engine: 'memory'
});
```

- Use File
```javascript
var mongoose = require('mongoose');
var cachegoose = require('recachegoose');

cachegoose(mongoose, {
  engine: 'file'
});
```

- Use Redis
```javascript
var mongoose = require('mongoose');
var cachegoose = require('recachegoose');

cachegoose(mongoose, {
  engine: 'redis',
  port: 6379,
  host: 'localhost'
});

// or with redis url connection string
// redis[s]://[[username][:password]@][host][:port][/db-number]
cachegoose(mongoose, {
  engine: 'redis',
  url: 'redis://localhost:6379'
});

// or with redis client with connection string
// backwards compatibility
cachegoose(mongoose, {
  engine: 'redis',
  client: 'redis://localhost:6379'
});

// backwards compatibility
cachegoose(mongoose, {
  engine: 'redis',
  client: require('redis').createClient('redis://localhost:6379')
});
```

- Set Cache
```js
Record
  .find({ some_condition: true })
  .cache(30) // The number of seconds to cache the query.  Defaults to 60 seconds.
  .exec(function(err, records) { // You are able to use callback or promise
    ...
  });

Record
  .aggregate()
  .group({ total: { $sum: '$some_field' } })
  .cache(0) // Explicitly passing in 0 will cache the results indefinitely.
  .exec(function(err, aggResults) {
    ...
  });
```

You can also pass a custom key into the `.cache()` method, which you can then use later to clear the cached content.

```javascript
var userId = '1234567890';

Children
  .find({ parentId: userId })
  .cache(0, userId + '-children') /* Will create a redis entry          */
  .exec(function(err, records) {  /* with the key '1234567890-children' */
    ...
  });

ChildrenSchema.post('save', function(child) {
  // Clear the parent's cache, since a new child has been added.
  cachegoose.clearCache(child.parentId + '-children');
});
```

Insert `.cache()` into the queries you want to cache, and they will be cached.  Works with `select`, `lean`, `sort`, and anything else that will modify the results of a query.

## Clearing the cache ##

If you want to clear the cache for a specific query, you must specify the cache key yourself:

```js
function getChildrenByParentId(parentId, cb) {
  Children
    .find({ parentId })
    .cache(0, `${parentId}_children`)
    .exec(cb);
}

function clearChildrenByParentIdCache(parentId, cb) {
  cachegoose.clearCache(`${parentId}_children`, cb);
}
```

If you call `cachegoose.clearCache(null, cb)` without passing a cache key as the first parameter, the entire cache will be cleared for all queries.

## Caching populated documents ##

When a document is returned from the cache, cachegoose will [hydrate](http://mongoosejs.com/docs/api.html#model_Model.hydrate) it, which initializes it's virtuals/methods. Hydrating a populated document will discard any populated fields (see [Automattic/mongoose#4727](https://github.com/Automattic/mongoose/issues/4727)). To cache populated documents without losing child documents, you must use `.lean()`, however if you do this you will not be able to use any virtuals/methods (it will be a plain object).

## Test ##
For development mode, you have to use minimum nodejs 14
```
npm test
```