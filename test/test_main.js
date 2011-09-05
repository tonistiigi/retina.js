(function() {
  var retina, test_main;
  retina = typeof require === 'function' ? require("../lib/retina") : this.retina;
  test_main = {
    "retina is present": function(test) {
      test.ok(retina);
      test.strictEqual("object", typeof retina);
      return test.done();
    },
    "some basic functions are present": function(test) {
      var functions, name, _i, _len, _ref;
      functions = "addParser allParsers removeParser clearParsers setParser scan setManualMode activateElement ignoreElement";
      _ref = functions.split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        test.ok(retina != null ? retina[name] : void 0, "Missing retina." + name);
        test.strictEqual("function", typeof (retina != null ? retina[name] : void 0), "retina." + name + " is not a function");
      }
      return test.done();
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
    }
  };
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = test_main;
  } else {
    this.test_main = test_main;
  }
}).call(this);
