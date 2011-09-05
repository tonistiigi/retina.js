(function() {
  var nodeunit, retina, test_main, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (__hasProp.call(this, i) && this[i] === item) return i;
    }
    return -1;
  };
  _ref = typeof require === 'function' ? [require("../lib/retina"), require("nodeunit")] : [this.retina, this.nodeunit], retina = _ref[0], nodeunit = _ref[1];
  test_main = {
    "retina is present": function(test) {
      test.ok(retina);
      test.strictEqual("object", typeof retina);
      return test.done();
    },
    "Some basic functions are present": function(test) {
      var functions, name, _i, _len, _ref2;
      functions = "addParser allParsers removeParser clearParsers setParser scan setManualMode activateElement ignoreElement";
      _ref2 = functions.split(" ");
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        name = _ref2[_i];
        test.ok(retina != null ? retina[name] : void 0, "Missing retina." + name);
        test.strictEqual("function", typeof (retina != null ? retina[name] : void 0), "retina." + name + " is not a function");
      }
      return test.done();
    },
    "Parsers management": nodeunit.testCase({
      setUp: function(callback) {
        return callback();
      },
      tearDown: function(callback) {
        retina.setParser(new retina.DefaultParser);
        return callback();
      },
      "allParsers() returns array": function(test) {
        test.ok(retina.allParsers() instanceof Array);
        return test.done();
      },
      "DefaultParser is added automatically": function(test) {
        var parsers;
        parsers = retina.allParsers();
        test.strictEqual(parsers.length, 1, "Parsers array doesn't contain one object");
        test.ok(parsers[0] instanceof retina.DefaultParser, "Default parser is not instance of DefaultParser");
        return test.done();
      },
      "Adding invalid parser": function(test) {
        test.throws((function() {
          return retina.addParser();
        }), "Invalid parser should throw");
        return test.done();
      },
      "Adding valid parser": function(test) {
        var sp;
        sp = new retina.StaticParser([]);
        retina.addParser(sp);
        test.strictEqual(retina.allParsers().length, 2, "Parsers count did not increment after add");
        test.ok(__indexOf.call(retina.allParsers(), sp) >= 0, "Added parser not found in parsers array");
        return test.done();
      },
      "Forbid simple push to parsers array": function(test) {
        var num_parsers, parsers;
        parsers = retina.allParsers();
        num_parsers = parsers.length;
        parsers.push(new retina.StaticParser([]));
        test.strictEqual(retina.allParsers().length, num_parsers);
        return test.done();
      },
      "Clear deletes all parsers": function(test) {
        test.notEqual(retina.allParsers().length, 0, "There should be parsers before clear");
        retina.clearParsers();
        test.strictEqual(retina.allParsers().length, 0, "All parsers were not removed");
        return test.done();
      },
      "SetParser adds only one": function(test) {
        var dp1, dp2, parsers;
        retina.addParser(new retina.StaticParser([]));
        dp1 = new retina.DefaultParser;
        retina.setParser(dp1);
        parsers = retina.allParsers();
        test.strictEqual(parsers.length, 1);
        test.strictEqual(parsers[0], dp1);
        dp2 = new retina.DefaultParser;
        retina.setParser(dp2);
        parsers = retina.allParsers();
        test.strictEqual(parsers.length, 1);
        test.strictEqual(parsers[0], dp2);
        return test.done();
      },
      "Deleting parsers individually": function(test) {
        var dp1, sp1, sp2;
        retina.clearParsers();
        retina.addParser(dp1 = new retina.DefaultParser);
        retina.addParser(sp1 = new retina.StaticParser([]));
        retina.addParser(sp2 = new retina.StaticParser([]));
        retina.removeParser(sp1);
        test.strictEqual(retina.allParsers().length, 2);
        test.ok(__indexOf.call(retina.allParsers(), dp1) >= 0);
        test.ok(__indexOf.call(retina.allParsers(), sp2) >= 0);
        retina.removeParser(new retina.DefaultParser);
        test.strictEqual(retina.allParsers().length, 2, "Deleting unused parser should not change active parsers");
        test.ok(__indexOf.call(retina.allParsers(), dp1) >= 0);
        test.ok(__indexOf.call(retina.allParsers(), sp2) >= 0);
        retina.removeParser(dp1);
        test.strictEqual(retina.allParsers().length, 1);
        test.ok(__indexOf.call(retina.allParsers(), sp2) >= 0);
        return test.done();
      },
      "Forbid directly deleting parsers from array": function(test) {
        var dp, num_parsers, parsers;
        retina.addParser(dp = new retina.DefaultParser);
        parsers = retina.allParsers();
        num_parsers = parsers.length;
        parsers.splice(parsers.length - 1, 1);
        test.strictEqual(retina.allParsers().length, num_parsers);
        return test.done();
      }
    })
  };
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = test_main;
  } else {
    this.test_main = test_main;
  }
}).call(this);
