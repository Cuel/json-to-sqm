'use strict'

const test = require('tape')
const fs = require('fs')
const classParser = require('arma-class-parser')
const JsonToSqm = require('../')

test('it returns a function', function (t) {
  t.ok(typeof JsonToSqm === 'function')
  t.end()
})

test('it expects Mission to be present and object', function (t) {
  let j = {}
  t.throws(JsonToSqm.bind(null, j))

  j = ''
  t.throws(JsonToSqm.bind(null, j))

  t.end()
})

test('it takes a JSON object', function (t) {
  let j = {Mission: {}}
  t.doesNotThrow(JsonToSqm.bind(null, j))
  t.end()
})

test('it takes a valid JSON string', function (t) {
  let j = '{"Mission": {}}'
  t.doesNotThrow(JsonToSqm.bind(null, j))
  t.end()
})

test('it parses numbers', function (t) {
  let j = {value: 123, Mission: {}}
  let exp = 'value=123;\r\nclass Mission\r\n{\r\n};\r\n'
  t.equals(JsonToSqm(j), exp)
  t.end()
})

test('it parses string', function (t) {
  let j = {value: 'test', Mission: {}}
  let exp = 'value="test";\r\nclass Mission\r\n{\r\n};\r\n'
  t.equals(JsonToSqm(j), exp)
  t.end()
})

test('it parses an array', function (t) {
  let j = {value: [123, 321], Mission: {}}
  let exp = 'value[]={123,321};\r\nclass Mission\r\n{\r\n};\r\n'
  t.equals(JsonToSqm(j), exp)
  t.end()
})

test('it parses an addOns array with linebreaks', function (t) {
  let j = {addOns: ['A', 'B'], Mission: {}}
  let exp = 'addOns[]=\r\n{\r\n\t"A",\r\n\t"B"\r\n};\r\nclass Mission\r\n{\r\n};\r\n'
  t.equals(JsonToSqm(j), exp)
  t.end()
})

test('it parses an object', function (t) {
  let j = {value: {}, Mission: {}}
  let exp = 'class value\r\n{\r\n};\r\nclass Mission\r\n{\r\n};\r\n'
  t.equals(JsonToSqm(j), exp)
  t.end()
})

test('it indents several levels', function (t) {
  let j = { Mission: { l1: { l2: {} } } }
  let exp = 'class Mission\r\n{\r\n\tclass l1\r\n\t{\r\n\t\tclass l2\r\n\t\t{\r\n\t\t};\r\n\t};\r\n};\r\n'
  t.equals(JsonToSqm(j), exp)
  t.end()
})

test('it prints the same sqm after conversion', function (t) {
  fs.readFile('./test/fixture.sqm', 'utf8', function (err, originalSqm) {
    t.ifError(err, 'read fixture file')
    var json
    t.doesNotThrow(function () {
      json = classParser(originalSqm)
    })

    let out = JsonToSqm(json)
    t.equals(out, originalSqm, 'read sqm matches output')
    t.end()
  })
})
