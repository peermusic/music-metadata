var id3 = require('id3-parser')

module.exports = metadata

// " - " gets replaced by a generic separator regex
// " " gets replaced by a generic whitespace regex
var parseFormats = [
  '(%artist% - %album%) %title%',
  '(%artist% - %album%) %title% %year%',
  '(%artist% - %album% - %track%) %title%',
  '%artist% - %album% - %track% - %title%',
  '%artist% - %album% - %track% - %title% (%year%)',
  '%artist% - %album% (%year%) - %track% - %title%',
  '%artist% - %title%',
  '%track% %title%',
  '%track% - %title%',
  '%album% - %artist% - %title%',
  '%track% %artist% - %title%',
  '%track% - %artist% - %title%'
].map(convertFormatIntoRegex)

function metadata (file, callback) {
  var filename = file.name.replace(/^(.*)(\..{3})$/, '$1')

  var tags = {
    title: filename,
    artist: null,
    album: null,
    track: null,
    year: null
  }

  // Grab the metadata from the filename
  tags = mergeTags(tags, tagsFromFilename(filename))

  // Grab the metadata from the id3 tags (v1 and v2)
  id3.parse(file).then(function (id3_tags) {
    id3_tags = {
      title: id3_tags.title ? id3_tags.title : null,
      artist: id3_tags.artist || id3_tags.band ? id3_tags.artist || id3_tags.band : null,
      album: id3_tags.album ? id3_tags.album : null,
      track: id3_tags.track ? parseInt(id3_tags.track, 10) : null,
      year: id3_tags.year ? parseInt(id3_tags.year, 10) : null
    }

    // We only have a title as the id3 tag -> lets try to parse it
    if (id3_tags.title && id3_tags.artist == null && id3_tags.album == null && id3_tags.track == null && id3_tags.year == null) {
      id3_tags = tagsFromFilename(id3_tags.title) || id3_tags
    }

    tags = mergeTags(tags, id3_tags)
    callback(tags)
  })
}

function mergeTags (tags, new_tags) {
  for (var i in tags) {
    if (!new_tags[i]) continue

    if (typeof new_tags[i] === 'string') {
      new_tags[i] = new_tags[i].trim()
      if (new_tags[i] === '') continue
    }

    tags[i] = new_tags[i]
  }
  return tags
}

function convertFormatIntoRegex (format) {
  var regularExpressions = {
    '-': '[-\\/\\|]+',
    ' ': '\\s+',
    '%title%': '(.+)',
    '%artist%': '(.+)',
    '%album%': '(.+)',
    '%track%': '([\\d]+)\.?',
    '%year%': '([\\d]+)'
  }

  // Parse the type order so we know which capture group is what later
  var types = format.match(/%([^%]*)%/g).map(function (x) {
    return x.replace(/%/g, '')
  })

  // Make sure escape all regular expression stuff in the formatting
  format = format.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')

  // Go through the string and replace the formatting string with their corresponding regexes
  for (var key in regularExpressions) {
    format = format.replace(new RegExp(key, 'g'), regularExpressions[key])
  }

  return [new RegExp('^' + format + '$'), types]
}

function tagsFromFilename (filename) {
  var best_match = {}

  for (var i = 0; i !== parseFormats.length; i++) {
    var parsed = filename.match(parseFormats[i][0])
    if (parsed == null) continue

    // Fill the fields based on the field names
    var fields = {}
    for (var j = 0; j !== parseFormats[i][1].length; j++) {
      var name = parseFormats[i][1][j]
      fields[name] = name === 'year' || name === 'track' ? parseInt(parsed[1 + j], 10) : parsed[1 + j]
    }

    // Take the object with the most filled fields
    if (Object.keys(fields).length >= Object.keys(best_match).length) {
      best_match = fields
    }
  }

  return best_match
}
