# multer-ftp

FTP storage engine for multer.

## Installation

```sh
$ npm install --save multer-ftp
```

## Basic Usage

```javascript
var multer = require('multer')
var FTPStorage = require('multer-ftp')

var upload = multer({
  storage: new FTPStorage({
    basepath: '/remote/path',
    ftp: {
      host: 'example.com',
      secure: true, // enables FTPS/FTP with TLS
      user: 'user',
      password: 'password'
    }
  })
})
```

For more FTP connection options see [`ftp` module `connect` method](https://github.com/mscdex/node-ftp#methods).

## Different filenames

By default random filenames are chosen (`crypto.randomBytes`), you can change this behavior however by using a custom `destination` function:

```javascript
// Demonstrates destination that uses sha1 digest of file
var multer = require('multer')
var crypto = require('crypto')
var FTPStorage = require('multer-ftp')

var upload = multer({
  storage: new FTPStorage({
    destination: function (req, file, options, callback) {
      var digest = crypto.createHash('sha1')

      digest.setEncoding('hex')

      file.stream.pipe(digest)

      file.stream.on('end', function () {
        digest.end()
        callback(null, digest.read())
      })
    },
    ftp: { /* ... */ }
  })
})
```

## Advanced usage

```javascript
var multer = require('multer')
var FTPStorage = require('multer-ftp')
var FTP = require('ftp')

var upload = multer({
  storage: new FTPStorage({
    basepath: '/remote/path', // base path for file uploads on the server
    ftp: { /* ... */ }, // FTP connection options, see `ftp` node module for more
    connection: new FTP(), // pass existing instance of `ftp`
    destination: function (req, file, options, callback) {
      callback(null, 'testfilename') // custom file destination, file extension is added to the end of the path
    },
    transformFile: function (req, file, callback) {
      // transform the file before uploading it
      //   file.stream is a ReadableStream of the file
      //   callback(error, < ReadableStream | Buffer | String >)
      callback(null, file.stream)
    }
  })
})
```

## Todo

Write tests

## License

[MIT](LICENSE)