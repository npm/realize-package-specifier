"use strict"
var fs = require('fs')
var path = require('path')
var dz = require('dezalgo')
var npa = require("npm-package-arg")

module.exports = function (spec, where, cb) {
  if (where instanceof Function) cb = where, where = "."
  cb = dz(cb)
  try {
    var dep = npa(spec)
    var specpath = path.resolve(where, dep.type == "local" ? dep.spec : spec)
    fs.stat(specpath, function (er, s) {
      if (er) return cb(null, dep)
      if (!s.isDirectory()) return dep.spec = spec, dep.type = "local", cb(null, dep)
      fs.stat(path.join(specpath, "package.json"), function (er) {
          if (er) return cb(null, dep)
          return dep.spec = spec, dep.type = "directory", cb(null, dep)
      })
    })
  }
  catch (e) {
      return cb(e)
  }
}
