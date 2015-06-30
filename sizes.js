var _ = require('underscore')
var casper = require('casper').create({
  pageSettings: {
    loadImages: true,
  },
  viewportSize: {width: 1024, height: 768}
})

var baseUrl = casper.cli.get(0) || 'http://localhost:3000'
var images = []
var mediaRules = []

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

function getMediaRules () {
  var sheets = [].map.call(document.styleSheets, function (s) {
    var rules = [].map.call(s.rules, function (r) {
      return {
        media: r.media
      }
    })
    return {
      href: s.href,
      rules: rules
    }
  })

  // return sheets
  return sheets
    .reduce(function (all, curr) { return all.concat(curr.rules) }, [])
    .filter(function (r) { return !!r.media })
    .map(function (r) { return r.media.mediaText })
}

function matchDomain (e) {
  return e.src.indexOf(baseUrl) > -1
}

function toString (e) {
  return [e.src.substring(baseUrl.length), e.width, e.naturalWidth].join(' ')
}

casper.start(baseUrl, function () {
  images = this.evaluate(getImageMeta)
  images = images.filter(matchDomain)
  mediaRules = this.evaluate(getMediaRules)
})

casper.run(function () {
  this.echo(images.length + ' images found:')
  this.echo(images.map(toString).join('\n'))
  this.echo('')

  var breakpoints = mediaRules.filter(function (t) {
    return t.indexOf('-width') > -1
  })
  breakpoints = _.uniq(breakpoints)
  this.echo(breakpoints.length + ' breakpoints found')
  this.echo(breakpoints.join('\n'))
  this.echo('')

  var widths = breakpoints.reduce(function (widths, t) {
    var re = /(\d+px)/g
    var res = t.match(re)
    if (!res) return widths
    return widths.concat(res)
  }, [])

  widths = _.uniq(widths)
  this.echo(widths.length + ' widths found')
  this.echo(widths.join('\n'))

  this.exit()
})
