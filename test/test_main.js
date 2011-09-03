(function() {
  var retina, test_main;
  retina = typeof require === 'function' ? require("../lib/retina") : this.retina;
  test_main = {
    "retina is present": function(test) {
      test.ok(retina);
      return test.done();
    }
  };
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = test_main;
  } else {
    this.test_main = test_main;
  }
}).call(this);
