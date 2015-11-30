# music-metadata

Parsing a music file into it's metadata. We prioritize id3 v2 over id3 v1 over the file name parsing

## Install

```sh
npm install https://github.com/peermusic/music-metadata
```

## Usage

```js
var musicMetadata = require('music-metadata')
musicMetadata(file, function (tags) {
  console.log(tags)
})
```

For reference see the [Browserify Handbook](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Parsing Tests

```sh
npm install -g mocha
mocha
```