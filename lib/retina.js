(function() {
  var DefaultParser, StaticParser, activate_element, add_parser, calc_zoom_level, clear_parsers, delete_parser, ignore_element, parsers, retina, scan, set_manual_mode, set_parser;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  DefaultParser = (function() {
    function DefaultParser() {}
    DefaultParser.prototype._pattern = /([\.\-_][0-9])?@(([0-9])+x)?\.[a-z]+$/i;
    DefaultParser.prototype.isValidFilename = function(filename) {
      return !!filename.match(this._pattern);
    };
    DefaultParser.prototype.zoomLevelsForFilename = function(filename) {
      var match;
      match = filename.match(this._pattern);
      if (match[1]) {
        return parseInt(match.slice(1), 10);
      } else {
        return 2;
      }
    };
    DefaultParser.prototype.filnameForZoom = function(baseFilename, zoom) {
      var match;
      if (zoom === 1) {
        return baseFilename;
      } else {
        match = baseFilename.match(/(.+)@(.*?)\.([a-z]+)$/i);
        return match[1] + "@" + Math.pow(2, zoom - 1) + "x." + match[3];
      }
    };
    return DefaultParser;
  })();
  StaticParser = (function() {
    function StaticParser(conf) {
      this.conf = conf != null ? conf : [];
    }
    StaticParser.prototype._confForFilename = function(filename) {
      var conf, _i, _len, _ref;
      _ref = this.conf;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        conf = _ref[_i];
        if (typeof conf === "string") {
          conf = [conf];
        }
        if (filename.match(new RegExp("" + conf[0] + "$"))) {
          return conf;
        }
      }
      return null;
    };
    StaticParser.prototype.isValidFilename = function(filename) {
      return !!this._confForFilename(filename);
    };
    StaticParser.prototype.zoomLevelsForFilename = function(filename) {
      var conf;
      conf = this._confForFilename(filename);
      if (conf.length > 1) {
        if (conf[1] === "number") {
          return conf[1];
        } else {
          return conf.length;
        }
      } else {
        return 2;
      }
    };
    StaticParser.prototype.filnameForZoom = function(baseFilename, zoom) {
      var conf, filename, parts, zoom_sfx;
      conf = this._confForFilename(baseFilename);
      filename = conf[0];
      if (conf.length === 1 || conf.length > 1 && typeof conf[1] === "number") {
        if (zoom === 1) {
          return baseFilename;
        } else {
          parts = baseFilename.match(/(.+)\.([a-z]+$)/i);
          zoom_sfx = zoom === 1 ? "" : "@" + Math.pow(2, zoom - 1);
          return "" + parts[1] + zoom_sfx + "." + parts[2];
        }
      } else {
        return conf[zoom - 1];
      }
    };
    return StaticParser;
  })();
  parsers = [];
  calc_zoom_level = function() {};
  add_parser = function(parser) {
    return parsers.push(parser);
  };
  delete_parser = function(parser) {
    var index;
    if (__indexOf.call(parsers, parser) >= 0) {
      index = parsers.indexOf(parser);
      return parsers.splice(index, 1);
    }
  };
  clear_parsers = function() {
    while (parsers.length) {
      delete_parser(parsers[0]);
    }
  };
  set_parser = function(parser) {
    if (parsers.length !== 1 || parsers[0] !== parser) {
      clear_parsers;
      return add_parser(parser);
    }
  };
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
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = retina;
  } else {
    this.retina = retina;
  }
}).call(this);
