(function() {
  var nodeunit, retina, test_staticparser, _ref;
  _ref = typeof require === 'function' ? [require("../lib/retina"), require("nodeunit")] : [this.retina, this.nodeunit], retina = _ref[0], nodeunit = _ref[1];
  test_staticparser = {
    "retina.StaticParser is present": function(test) {
      test.ok(retina.StaticParser);
      test.strictEqual("function", typeof retina.StaticParser, "StaticParser is not a function");
      return test.done();
    },
    "StaticParser tests": nodeunit.testCase({
      setUp: function(callback) {
        this.sp = new retina.StaticParser(["myimage.png", "path/to/my_image.png", "at/symbols/still/supported@.jpg", "default/zoom/still/supported@1x.jpg", "upPeRCASE/fileName.PNg", ["with/zoom/levels.png", 3], ["path/to/my_photo.png", "path/to/my_photo_big.png"], ["assets/pattern_m.png", "assets/pattern_l.png", "assets/pattern_xl.png"]]);
        return callback();
      },
      tearDown: function(callback) {
        return callback();
      },
      "Valid filenames for StaticParser": function(test) {
        var filenames, name, _i, _len;
        filenames = ["myimage.png", "http://myhost.com/images/myimage.png", "path/to/my_image.png", "at/symbols/still/supported@.jpg", "path/to/upPeRCASE/fileName.PNg", "default/zoom/still/supported@1x.jpg", "with/zoom/levels.png", "path/to/my_photo.png", "assets/pattern_m.png"];
        for (_i = 0, _len = filenames.length; _i < _len; _i++) {
          name = filenames[_i];
          test.ok(this.sp.isValidFilename(name), "" + name + " does not match StaticParser");
        }
        return test.done();
      },
      "Invalid filenames for StaticParser": function(test) {
        var filenames, name, _i, _len;
        filenames = ["myimage.jpg", "myimage.PNG", "myimage.png.png", "myimage@2x.png", "myimage@1x.png", "path/to/other/my_image.png"];
        for (_i = 0, _len = filenames.length; _i < _len; _i++) {
          name = filenames[_i];
          test.ok(!this.sp.isValidFilename(name), "" + name + " should not match StaticParser");
        }
        return test.done();
      },
      "Zoomlevels from filenames": function(test) {
        var name, zoom, zoomlevels;
        zoomlevels = {
          "myimage.png": [1, 2],
          "with/zoom/levels.png": [1, 2, 4],
          "path/to/my_photo.png": [1, 2],
          "assets/pattern_m.png": [1, 2, 4]
        };
        for (name in zoomlevels) {
          zoom = zoomlevels[name];
          test.deepEqual(this.sp.zoomLevelsForFilename(name), zoom, "Calculated zoomlevels for " + name + " do not match " + zoom);
        }
        return test.done();
      },
      "Correct filenames for other zoomLevels": function(test) {
        var baseName, files, name, tests, zoom;
        files = {
          "myimage.png": {
            1: "myimage.png",
            2: "myimage@2x.png"
          },
          "at/symbols/still/supported@.jpg": {
            1: "at/symbols/still/supported@.jpg",
            2: "at/symbols/still/supported@2x.jpg"
          },
          "http://myhost.com/images/myimage.png": {
            1: "http://myhost.com/images/myimage.png",
            2: "http://myhost.com/images/myimage@2x.png"
          },
          "path/to/my_photo.png": {
            1: "path/to/my_photo.png",
            2: "path/to/my_photo_big.png"
          },
          "default/zoom/still/supported@1x.jpg": {
            1: "default/zoom/still/supported@1x.jpg",
            2: "default/zoom/still/supported@2x.jpg"
          },
          "assets/pattern_m.png": {
            1: "assets/pattern_m.png",
            2: "assets/pattern_l.png",
            3: "assets/pattern_xl.png"
          }
        };
        for (baseName in files) {
          tests = files[baseName];
          for (zoom in tests) {
            name = tests[zoom];
            test.strictEqual(this.sp.filenameForZoom(baseName, parseInt(zoom, 10)), name, "Filename on zoom " + zoom + " for " + baseName + " is not " + name);
          }
        }
        return test.done();
      }
    })
  };
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = test_staticparser;
  } else {
    this.test_staticparser = test_staticparser;
  }
}).call(this);
