[retina, nodeunit] = 
    if typeof require == 'function'
        [(require "../lib/retina"), require "nodeunit"]
    else 
        [this.retina, this.nodeunit]

test_staticparser =
    "retina.StaticParser is present": (test) ->
        test.ok retina.StaticParser
        test.strictEqual "function", typeof retina.StaticParser, "StaticParser is not a function"
        test.done()

    "StaticParser tests": nodeunit.testCase 
        setUp: (callback) ->
            @sp = new retina.StaticParser [
                "myimage.png"
                "path/to/my_image.png"
                "at/symbols/still/supported@.jpg"
                "default/zoom/still/supported@1x.jpg"
                "upPeRCASE/fileName.PNg"
                ["with/zoom/levels.png", 3],
                ["path/to/my_photo.png", "path/to/my_photo_big.png"]
                ["assets/pattern_m.png", "assets/pattern_l.png", "assets/pattern_xl.png"]
            ]
            callback()

        tearDown: (callback) ->
            callback()

        "Valid filenames for StaticParser": (test) ->
            filenames = [
                "myimage.png"
                "http://myhost.com/images/myimage.png"
                "path/to/my_image.png"
                "at/symbols/still/supported@.jpg"
                "path/to/upPeRCASE/fileName.PNg"
                "default/zoom/still/supported@1x.jpg"
                "with/zoom/levels.png"
                "path/to/my_photo.png"
                "assets/pattern_m.png"
                ]
            for name in filenames
                test.ok (@sp.isValidFilename name), "#{name} does not match StaticParser"
            test.done()

         "Invalid filenames for StaticParser": (test) ->
            filenames = [
                "myimage.jpg"
                "myimage.PNG"
                "myimage.png.png"
                "myimage@2x.png"
                "myimage@1x.png"
                "path/to/other/my_image.png"
                ]
            for name in filenames
                test.ok (!@sp.isValidFilename name), "#{name} should not match StaticParser"
            test.done()

        "Zoomlevels from filenames": (test) ->
            zoomlevels = "myimage.png":2,  "with/zoom/levels.png":3,    "path/to/my_photo.png":2,    "assets/pattern_m.png":3
            for name, zoom of zoomlevels
                test.strictEqual (@sp.zoomLevelsForFilename name), zoom, "Calculated zoomlevels for #{name} do not match #{zoom}"
            test.done()

        "Correct filenames for other zoomLevels": (test) ->
            files =
                "myimage.png":
                    1 : "myimage.png"
                    2 : "myimage@2x.png"
                "at/symbols/still/supported@.jpg":
                    1 : "at/symbols/still/supported@.jpg"
                    2 : "at/symbols/still/supported@2x.jpg"
                "http://myhost.com/images/myimage.png":
                    1 : "http://myhost.com/images/myimage.png"
                    2 : "http://myhost.com/images/myimage@2x.png"
                "path/to/my_photo.png":
                    1 : "path/to/my_photo.png"
                    2 : "path/to/my_photo_big.png"
                "default/zoom/still/supported@1x.jpg":
                    1 : "default/zoom/still/supported@1x.jpg"
                    2 : "default/zoom/still/supported@2x.jpg"
                "assets/pattern_m.png":
                    1 : "assets/pattern_m.png"
                    2 : "assets/pattern_l.png"
                    3 : "assets/pattern_xl.png"

            for baseName, tests of files
                for zoom, name of tests
                    test.strictEqual (@sp.filenameForZoom baseName, parseInt zoom, 10), name,
                        "Filename on zoom #{zoom} for #{baseName} is not #{name}"
            test.done()


if module?.exports?
    module.exports = test_staticparser
else
    this.test_staticparser = test_staticparser
