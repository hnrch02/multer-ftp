# multer-ftp

FTP storage engine for multer.

## Installation

```sh
$ npm install --save multer-ftp
```

## Usage

Basic usage example:

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

---

You can also use an existing instance of `ftp` instead of `multer-ftp` creating a new one: (added in v1.1)

```javascript
var multer = require('multer')
var FTPStorage = require('multer-ftp')
var FTP = require('ftp')
var ftp = new FTP()

ftp.connect({
  host: 'example.com',
  user: 'user',
  password: 'password'
})

var upload = multer({
  storage: new FTPStorage({
    basepath: '/remote/path',
    connection: ftp
  })
})
```

---

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

## Todo

Write tests

## License

[MIT](LICENSE)