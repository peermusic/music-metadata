var assert = require('assert');
var rewire = require("rewire");
var module = rewire('../index.js');

var tests = [
    {
        format: '(%artist% - %album%) %title%',
        filename: '(Slipknot - All Hope Is Gone) Sulfur',
        expected: {artist: 'Slipknot', album: 'All Hope Is Gone', title: 'Sulfur'}
    },
    {
        format: '(%artist% - %album%) %title% %year%',
        filename: '(Slipknot - All Hope Is Gone) Sulfur 2008',
        expected: {artist: 'Slipknot', album: 'All Hope Is Gone', title: 'Sulfur', year: 2008}
    },
    {
        format: '(%artist% - %album% - %track%) %title%',
        filename: '(Slipknot - All Hope Is Gone - 08) Sulfur',
        expected: {artist: 'Slipknot', album: 'All Hope Is Gone', title: 'Sulfur', track: 8}
    },
    {
        format: '%artist% - %album% - %track% - %title%',
        filename: 'Slipknot - All Hope Is Gone - 08 - Sulfur',
        expected: {artist: 'Slipknot', album: 'All Hope Is Gone', title: 'Sulfur', track: 8}
    },
    {
        format: '%artist% - %album% - %track% - %title% (%year%)',
        filename: 'Slipknot - All Hope Is Gone - 08 - Sulfur (2008)',
        expected: {artist: 'Slipknot', album: 'All Hope Is Gone', title: 'Sulfur', year: 2008, track: 8}
    },
    {
        format: '%artist% - %album% (%year%) - %track% - %title%',
        filename: 'Slipknot - All Hope Is Gone (2008) - 08 - Sulfur',
        expected: {artist: 'Slipknot', album: 'All Hope Is Gone', title: 'Sulfur', year: 2008, track: 8}
    },
    {
        format: '%artist% - %title%',
        filename: 'Slipknot - Sulfur',
        expected: {artist: 'Slipknot', title: 'Sulfur'}
    },
    {
        format: '%track% - %title%',
        filename: '08 - Sulfur',
        expected: {title: 'Sulfur', track: 8}
    },
    {
        format: '%track% %title%',
        filename: '08 Sulfur',
        expected: {title: 'Sulfur', track: 8}
    },
    {
        format: '%album% - %artist% - %title%',
        filename: 'All Hope Is Gone - Slipknot - Sulfur',
        expected: {artist: 'Slipknot', album: 'All Hope Is Gone', title: 'Sulfur'}
    },
    {
        format: '%track% %artist% - %title%',
        filename: '08 Slipknot - Sulfur',
        expected: {artist: 'Slipknot', title: 'Sulfur', track: 8}
    },
    {
        format: '%track% - %artist% - %title%',
        filename: '08 - Slipknot - Sulfur',
        expected: {artist: 'Slipknot', title: 'Sulfur', track: 8}
    }
];

describe('The file parser', function () {

    for (var i in tests) {

        (function (test) {

            it('should parse the format "' + test.format + '"', function () {
                assert.deepEqual(test.expected, module.__get__('tagsFromFilename')(test.filename));
            })

        })(tests[i]);

    }

});