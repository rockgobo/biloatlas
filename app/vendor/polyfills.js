/*globals Array:true, String:true*/

// POLYFILL Array.find
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined')
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function')
    }
    var list = Object(this)
    var length = list.length >>> 0
    var thisArg = arguments[1]
    var value

    for (var i = 0; i < length; i++) {
      value = list[i]
      if (predicate.call(thisArg, value, i, list)) {
        return value
      }
    }
    return undefined
  }
}

// POLYFILL Array.isArray
if (!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === '[object Array]'
  }
}

// POLYFILL String.trim()
if (!String.prototype.trim) {
  (function () {
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    String.prototype.trim = function () {
      return this.replace(rtrim, '')
    }
  })()
}

// POLYFILL Object assign
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}
