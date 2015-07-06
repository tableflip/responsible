#! /usr/bin/env node
/*
Usage: resize -w 160 /path/to/file
*/
var path = require('path')
var gm = require('gm')
var argv = require('minimist')(process.argv.slice(2))

// 180
var width = parseInt(argv.w, 10)
// ~/pictures/foo.jpg
var filepath = argv._[0]
// ~/pictures
var basedir = path.dirname(filepath)
// .jpg
var extention = path.extname(filepath)
// foo
var filename = path.basename(filepath, extention)

// foo.180.jpg
var outfilename = filename + '.' + width + extention
// ~/pictures/foo.180.jpg
var outfilepath = path.join(basedir, outfilename)

gm(filepath)
  .resize(width)
  .define('jpeg:preserve-settings')
  .stream(outfilepath, function (err) {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
  })
