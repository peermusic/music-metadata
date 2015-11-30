# music-metadata

Parsing metadata of a music file. Data gets used in the following order:
- ID3 v2 
- ID3 v1
- file name parsing

## Install

```sh
npm install https://github.com/peermusic/music-metadata
```

## Usage

```js
var musicMetadata = require('music-metadata')
musicMetadata(file, function (tags) {
  console.log(tags) // "tags" is an object with title, artist, album, track and year
})
```

For reference see the [Browserify Handbook](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Tests for parsing

```sh
npm install -g mocha
mocha
```
