(function() {
  var DefaultParser, StaticParser, activate_element, add_parser, clear_parsers, ignore_element, parsers, remove_parser, retina, root, scan, set_manual_mode, set_parser, _active_controls, _active_elements, _current_zoom_level, _get_zoom_level, _ignore_list, _schedule_scan;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (__hasProp.call(this, i) && this[i] === item) return i;
    }
    return -1;
  };
  root = this;
  DefaultParser = (function() {
    function DefaultParser() {}
    DefaultParser.prototype._pattern = /([\.\-_][0-9])?@(1x)?\.[a-z]+$/i;
    DefaultParser.prototype.isValidFilename = function(filename) {
      return !!filename.match(this._pattern);
    };
    DefaultParser.prototype.zoomLevelsForFilename = function(filename) {
      var match;
      match = filename.match(this._pattern);
      if (match[1]) {
        return parseInt(match[1].slice(1), 10);
      } else {
        return 2;
      }
    };
    DefaultParser.prototype.filenameForZoom = function(baseFilename, zoom) {
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
        if (typeof conf === "string") conf = [conf];
        if (filename.match(new RegExp("" + conf[0] + "$"))) return conf;
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
        if (typeof conf[1] === "number") {
          return conf[1];
        } else {
          return conf.length;
        }
      } else {
        return 2;
      }
    };
    StaticParser.prototype.filenameForZoom = function(baseFilename, zoom) {
      var conf, filename, parts, zoom_sfx;
      conf = this._confForFilename(baseFilename);
      filename = conf[0];
      if (conf.length === 1 || conf.length > 1 && typeof conf[1] === "number") {
        if (zoom === 1) {
          return baseFilename;
        } else {
          parts = baseFilename.match(/(.+?)(@)?([0-9]+x)?\.([a-z]+$)/i);
          zoom_sfx = zoom === 1 ? "" : "@" + (Math.pow(2, zoom - 1)) + "x";
          return "" + parts[1] + zoom_sfx + "." + parts[4];
        }
      } else {
        return conf[zoom - 1];
      }
    };
    return StaticParser;
  })();
  _current_zoom_level = 1;
  _ignore_list = [];
  _active_elements = [];
  _active_controls = [];
  parsers = [];
  _get_zoom_level = function() {
    var screenWidth, userAgent, _ref, _ref2;
    userAgent = (_ref = root.navigator) != null ? _ref.userAgent : void 0;
    if (root.window && userAgent.match(/Webkit/i)) {
      return (userAgent.match(/Mobile/i) ? (screenWidth = (_ref2 = root.orientation) === 0 || _ref2 === 180 ? root.screen.width : root.screen.height, root.devicePixelRatio ? screenWidth *= root.devicePixelRatio : void 0) : root.document.width) / root.window.innerWidth;
    } else {
      return 1;
    }
  };
  add_parser = function(parser) {
    var func, _i, _len, _ref;
    _ref = "isValidFilename zoomLevelsForFilename filenameForZoom".split(" ");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      func = _ref[_i];
      if (typeof parser[func] !== "function") {
        throw "Invalid parser object. No method " + func + " found.";
      }
    }
    return parsers.push(parser);
  };
  remove_parser = function(parser) {
    var index;
    if (__indexOf.call(parsers, parser) >= 0) {
      index = parsers.indexOf(parser);
      return parsers.splice(index, 1);
    }
  };
  clear_parsers = function() {
    while (parsers.length) {
      remove_parser(parsers[0]);
    }
  };
  set_parser = function(parser) {
    if (parsers.length !== 1 || parsers[0] !== parser) {
      clear_parsers();
      return add_parser(parser);
    }
  };
  _schedule_scan = function(delay) {};
  scan = function() {
    var element, _i, _len, _ref, _ref2, _ref3;
    if ((_ref = root.document) != null ? _ref.querySelectorAll : void 0) {
      _ref2 = root.document.querySelectorAll("img[src],*[style*='background-image']");
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        element = _ref2[_i];
        if (__indexOf.call(_ignore_list, element) >= 0) continue;
        if (_ref3 = !element, __indexOf.call(_active_elements, _ref3) >= 0) {
          activate_element(element);
        }
      }
      return _schedule_scan(3000);
    }
  };
  set_manual_mode = function(manual) {
    if (manual == null) manual = true;
  };
  activate_element = function(element, url) {
    var control, is_image, parser, _i, _len;
    if (url == null) url = "";
    if (__indexOf.call(_active_elements, element) >= 0) return;
    is_image = element instanceof root.HTMLImageElement;
    url || (url = is_image ? element.src : element.style['backgroundImage'].match(/url\((.+)\)/)[1]);
    for (_i = 0, _len = parsers.length; _i < _len; _i++) {
      parser = parsers[_i];
      if (parser.isValidFilename(url)) {
        control = new RetinaControl(element, parser(is_image, url));
        _active_controls.push(control);
        _active_elements.push(element);
        return true;
      }
    }
    return false;
  };
  ignore_element = function(element) {};
  retina = {
    allParsers: function() {
      return parsers.slice();
    },
    addParser: add_parser,
    removeParser: remove_parser,
    clearParsers: clear_parsers,
    setParser: set_parser,
    scan: scan,
    setManualMode: set_manual_mode,
    activateElement: activate_element,
    ignoreElement: ignore_element,
    DefaultParser: DefaultParser,
    StaticParser: StaticParser
  };
  if (!(typeof RELEASE_MODE !== "undefined" && RELEASE_MODE !== null)) {
    retina._get_zoom_level = _get_zoom_level;
  }
  retina.addParser(new DefaultParser);
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = retina;
  } else {
    this.retina = retina;
  }
}).call(this);
