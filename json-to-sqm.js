(function (global) {
  'use strict'

  var utils = {
    isObject: function (obj) { return Object.prototype.toString.call(obj) === '[object Object]' },
    isString: function (str) { return typeof str === 'string' },
    isNumber: function (nr) { return typeof nr === 'number' },
    isArray: function (arr) { return Array.isArray(arr) }
  }

  var chars = {
    indent: function (nr) {
      var ret = ''
      for (var i = 0; i < nr; i++) {
        ret += '\t'
      }
      return ret
    },
    REG_ADDONS: /^addOns/,
    LF: '\r\n',
    lineBreakIndent: function (nr) { return chars.LF + chars.indent(nr) }
  }

  function beginClass (className, indentLevel) {
    return chars.indent(indentLevel) + 'class ' + className + chars.lineBreakIndent(indentLevel) + '{' + chars.LF
  }

  function endClass (indentLevel) {
    return chars.indent(indentLevel) + '};'
  }

  function convertToSqmString (obj) {
    var indentLevel = 0
    var ret = ''

    var parseObject = function parseObject (obj) {
      iterateObject(obj, function (key, value) {
        if (utils.isObject(value)) {
          ret += beginClass(key, indentLevel++)
          parseObject(value)
          ret += endClass(--indentLevel)
        } else {
          ret += format(key, value, indentLevel)
        }
        ret += chars.LF
      })
    }

    parseObject(obj)
    return ret
  }

  function iterateObject (obj, cb) {
    Object.keys(obj).forEach(function (k) {
      cb(k, obj[k])
    })
  }

  /* Formats a single value, including array */
  function format (key, value, indentLevel) {
    var ret = chars.indent(indentLevel) + key
    switch (true) {
      case utils.isString(value): ret += '="' + value.replace(/"/g, '""') + '"'
        break
      case utils.isNumber(value): ret += '=' + value
        break
      case utils.isArray(value):
        var isAddOns = chars.REG_ADDONS.test(key)
        ret += '[]=' + (!isAddOns ? '{' : (chars.lineBreakIndent(indentLevel) + '{') + chars.LF)
        if (isAddOns) indentLevel++
        ret += formatArrayValues(value, indentLevel, isAddOns)
        if (isAddOns) indentLevel--
        ret += (!isAddOns ? '}' : (chars.LF + chars.indent(indentLevel) + '}'))
        break
      default: throw new Error('Unexpected type: key' + key + ', value: ' + value)
    }

    ret += ';'
    return ret
  }

  /* Format array values */
  function formatArrayValues (arr, indentLevel, indentEveryNewLine) {
    var ret = ''
    for (var i = 0, l = arr.length; i < l; i++) {
      var v = arr[i]
      if (indentEveryNewLine) ret += chars.indent(indentLevel)
      if (utils.isString(v)) ret += '"' + v.replace(/"/g, '""') + '"'
      else ret += v

      if (i !== l - 1) ret += ',' + (indentEveryNewLine ? chars.LF : '')
    }
    return ret
  }

  /* Export */
  function JsonToSqm (jsonSqm) {
    if (utils.isString(jsonSqm)) jsonSqm = JSON.parse(jsonSqm)

    if (!jsonSqm || !utils.isObject(jsonSqm.Mission)) {
      throw new Error('Missing "Mission" in JSON object')
    }

    return convertToSqmString(jsonSqm)
  }

  /*eslint-disable*/
  if (typeof define === 'function' && define.amd) {
    define(function () { return JsonToSqm })
  } else if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = JsonToSqm
  }
    exports.JsonToSqm = JsonToSqm
  } else {
    global.JsonToSqm = JsonToSqm
  }
  /*eslint-enable*/
})(this)
