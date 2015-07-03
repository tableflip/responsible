var _ = require('underscore')
var casper = require('casper').create({
  pageSettings: { loadImages: true },
  viewportSize: {
    width: 1024,
    height: 768
  }
})
var casper = require('casper').create()
var baseUrl = casper.cli.get(0) || 'http://localhost:3000'
var widths = casper.cli.args.slice(1)
var data = {}

function getImageMeta () {
  var img = document.querySelectorAll('img')
  return [].map.call(img, function (img) {
    // return img.naturalWidth + 'x' + img.naturalHeight
    return {
      src: img.src,
      width: img.width,
      height: img.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }
  })
}

function trimToPath (url) {
  return url.substring(baseUrl.length)
}

function matchDomain (e) {
  return e.src.indexOf(baseUrl) > -1
}

casper.start(baseUrl, function () {
  this.echo('Loading' + this.getCurrentUrl(), 'info')
  this.echo('widths: ' + widths)
})

casper.each(widths, function (casper, width) {
  this.then(function () {
    this.viewport(width, 768)
  })
  this.thenOpen(baseUrl, function () {
    this.wait(1000)
  })
  this.then(function () {
    this.evaluate(getImageMeta)
      .filter(matchDomain)
      .forEach(function (img) {
        var path = trimToPath(img.src)
        var datum = data[path]
        if (!datum) datum = data[path] = []
        datum.push(img.width + 'x' + img.height)
        // this.echo(path + ': '+ img.width + 'x' + img.height)
      }.bind(this))
  this.echo(width + ' done.')
  })
})

casper.run(function () {
  Object.keys(data).forEach(function (path) {
    var sizes = _.uniq(data[path])
    this.echo(path + ': ' + sizes)
  }.bind(this))
  this.exit()
})
