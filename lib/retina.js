(function() {
  var DefaultParser, StaticParser, activate_element, add_parser, calc_zoom_level, clear_parsers, ignore_element, parsers, retina, scan, set_manual_mode, set_parser;
  DefaultParser = (function() {
    function DefaultParser() {}
    DefaultParser.prototype.isValidFilename = function(filename) {};
    DefaultParser.prototype.zoomLevelsForFilename = function(filename) {};
    DefaultParser.prototype.filnameForZoom = function(baseFilename, zoom) {};
    return DefaultParser;
  })();
  StaticParser = (function() {
    function StaticParser(conf) {
      this.conf = conf;
    }
    StaticParser.prototype.isValidFilename = function(filename) {};
    StaticParser.prototype.zoomLevelsForFilename = function(filename) {};
    StaticParser.prototype.filnameForZoom = function(baseFilename, zoom) {};
    return StaticParser;
  })();
  parsers = [];
  calc_zoom_level = function() {};
  add_parser = function(parser) {};
  clear_parsers = function() {};
  set_parser = function(parser) {};
  scan = function() {};
  set_manual_mode = function(manual) {
    if (manual == null) {
      manual = true;
    }
  };
  activate_element = function(element, url, width, height) {
    if (url == null) {
      url = "";
    }
    if (width == null) {
      width = 0;
    }
    if (height == null) {
      height = 0;
    }
  };
  ignore_element = function(element) {};
  retina = {
    parsers: parsers,
    addParser: add_parser,
    clearParsers: clear_parsers,
    setParser: set_parser,
    scan: scan,
    setManualMode: set_manual_mode,
    activateElement: activate_element,
    ignoreElement: ignore_element,
    DefaultParser: DefaultParser,
    StaticParser: StaticParser
  };
  retina.addParser(new DefaultParser);
}).call(this);
