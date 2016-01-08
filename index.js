var Promise = require('bluebird')
var FTP = require('ftp')
var path = require('path')
var defaults = require('lodash.defaults')
var random = Promise.promisify(require('crypto').randomBytes)

function getDestination (req, file, opts, cb) {
  random(16).then(function(raw) {
    cb(null, path.join(opts.basepath, raw.toString('hex') + path.extname(file.originalname)))
  }, cb)
}

function FTPStorage (opts) {
  this.opts = defaults(opts, {
    basepath: '',
    destination: getDestination
  })

  if (this.opts.connection) {
    this.ftp = this.opts.connection
    this.ready = Promise.resolve()
  } else {
    this.ftp = new FTP()
    this.ready = new Promise(function (resolve, reject) {
      this.ftp.on('ready', resolve)
    }.bind(this))

    this.ftp.connect(this.opts.ftp)
  }
}

FTPStorage.prototype._handleFile = function _handleFile (req, file, cb) {
  this.ready.then(function () {
    this.opts.destination(req, file, this.opts, function (err, destination) {
      if (err) return cb(err)

      this.ftp.put(file.stream, destination, function (err) {
        if (err) return cb(err)

        cb(null, {
          path: destination
        })
      })
    }.bind(this))
  }.bind(this))
}

FTPStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  this.ready.then(function () {
    this.ftp.delete(file.path, cb)
  }.bind(this))
}

module.exports = FTPStorage