(function() {
  var retina, test_defaultparser;
  retina = typeof require === 'function' ? require("../lib/retina") : this.retina;
  test_defaultparser = {
    "retina.DefaultParser is present": function(test) {
      test.ok(retina.DefaultParser);
      test.strictEqual("function", typeof retina.DefaultParser, "DefaultParser is not a function");
      return test.done();
    },
    "DefaultParser has required functions": function(test) {
      var df, functions, name, _i, _len, _ref;
      df = new retina.DefaultParser;
      functions = "isValidFilename zoomLevelsForFilename filenameForZoom";
      _ref = functions.split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        test.ok(df[name], "Missing defaultParser." + name);
        test.strictEqual("function", typeof df[name], "defaultParser." + name + " is not a function");
      }
      return test.done();
    },
    "Valid filenames for DefaultParser": function(test) {
      var df, filenames, name, _i, _len;
      df = new retina.DefaultParser;
      filenames = ["myimage@.png", "my_long.filename-with/dashes@.jpg", "image/with/multiple@symblos@.png", "UpPerCASEletters@.JPeg", "with/default/zoom@1x.png", "has/image/count/in/filename-2@.png", "other/way/to/have/count.3@1x.jpg"];
      for (_i = 0, _len = filenames.length; _i < _len; _i++) {
        name = filenames[_i];
        test.ok(df.isValidFilename(name), "" + name + " does not match defaultParser");
      }
      return test.done();
    },
    "Invalid filenames for DefaultParser": function(test) {
      var df, filenames, name, _i, _len;
      df = new retina.DefaultParser;
      filenames = ["my/image.png", "myimage@img.png", "at/in/the/end.jpg@", "default/zoom/not/one@2x.png"];
      for (_i = 0, _len = filenames.length; _i < _len; _i++) {
        name = filenames[_i];
        test.ok(!df.isValidFilename(name), "" + name + " should not match defaultParser");
      }
      return test.done();
    },
    "Zoomlevels from filenames": function(test) {
      var df, name, zoom, zoomlevels;
      df = new retina.DefaultParser;
      zoomlevels = {
        "myimage@.png": [1, 2],
        "zoom/set@1x.jpg": [1, 2],
        "filename-2@.png": [1, 2],
        "image3@.jpg": [1, 2],
        "image.3@.jpg": [1, 2, 4]
      };
      for (name in zoomlevels) {
        zoom = zoomlevels[name];
        test.deepEqual(df.zoomLevelsForFilename(name), zoom, "Calculated zoomlevels for " + name + " do not match " + zoom);
      }
      return test.done();
    },
    "Correct filenames for other zoomLevels": function(test) {
      var baseName, df, files, name, tests, zoom;
      df = new retina.DefaultParser;
      files = {
        "myimage@.png": {
          1: "myimage@.png",
          2: "myimage@2x.png"
        },
        "with/default/zoom@1x.jpg": {
          1: "with/default/zoom@1x.jpg",
          2: "with/default/zoom@2x.jpg"
        },
        "with/image/count-3@.jpg": {
          1: "with/image/count-3@.jpg",
          2: "with/image/count-3@2x.jpg",
          4: "with/image/count-3@4x.jpg"
        }
      };
      for (baseName in files) {
        tests = files[baseName];
        for (zoom in tests) {
          name = tests[zoom];
          test.strictEqual(df.filenameForZoom(baseName, parseInt(zoom, 10)), name, "Filename on zoom " + zoom + " for " + baseName + " is not " + name);
        }
      }
      return test.done();
    }
  };
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = test_defaultparser;
  } else {
    this.test_defaultparser = test_defaultparser;
  }
}).call(this);
