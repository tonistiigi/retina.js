retina = if typeof require == 'function' then require "../lib/retina" else this.retina

test_defaultparser =
    "retina.DefaultParser is present": (test) ->
        test.ok retina.DefaultParser
        test.strictEqual "function", typeof retina.DefaultParser, "DefaultParser is not a function"
        test.done()

    "DefaultParser has required functions": (test) ->
        df = new retina.DefaultParser
        functions = "isValidFilename zoomLevelsForFilename filenameForZoom"
        for name in functions.split " "
            test.ok df[name],  "Missing defaultParser.#{name}"
            test.strictEqual "function", typeof df[name], "defaultParser.#{name} is not a function"
        test.done()

    "Valid filenames for DefaultParser": (test) ->
        df = new retina.DefaultParser
        filenames = [
            "myimage@.png"
            "my_long.filename-with/dashes@.jpg"
            "image/with/multiple@symblos@.png"
            "UpPerCASEletters@.JPeg"
            "with/default/zoom@1x.png"
            "has/image/count/in/filename-2@.png"
            "other/way/to/have/count.3@1x.jpg"
            ]
        for name in filenames
            test.ok (df.isValidFilename name), "#{name} does not match defaultParser"
        test.done()

    "Invalid filenames for DefaultParser": (test) ->
        df = new retina.DefaultParser
        filenames = [
            "my/image.png"
            "myimage@img.png"
            "at/in/the/end.jpg@"
            "default/zoom/not/one@2x.png"
            ]
        for name in filenames
            test.ok (!df.isValidFilename name), "#{name} should not match defaultParser"
        test.done()

    "Zoomlevels from filenames": (test) ->
        df = new retina.DefaultParser
        zoomlevels = "myimage@.png":2,  "zoom/set@1x.jpg":2,    "filename-2@.png":2,    "image.3@.jpg":3
        for name, zoom of zoomlevels
            test.strictEqual (df.zoomLevelsForFilename name), zoom, "Calculated zoomlevels for #{name} do not match #{zoom}"
        test.done()

    "Correct filenames for other zoomLevels": (test) ->
        df = new retina.DefaultParser
        files =
            "myimage@.png":
                1 : "myimage@.png"
                2 : "myimage@2x.png"
            "with/default/zoom@1x.jpg":
                1 : "with/default/zoom@1x.jpg"
                2 : "with/default/zoom@2x.jpg"
            "with/image/count-3@.jpg":
                1 : "with/image/count-3@.jpg",
                2 : "with/image/count-3@2x.jpg"
                3 : "with/image/count-3@4x.jpg"

        for baseName, tests of files
            for zoom, name of tests
                test.strictEqual (df.filenameForZoom baseName, parseInt zoom, 10), name,
                    "Filename on zoom #{zoom} for #{baseName} is not #{name}"
        test.done()

if module?.exports?
    module.exports = test_defaultparser
else
    this.test_defaultparser = test_defaultparser
