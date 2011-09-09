(function() {
  var DefaultParser, RetinaControl, StaticParser, activate_element, add_parser, clear_parsers, ignore_element, parsers, remove_parser, retina, root, scan, set_manual_mode, set_parser, _active_controls, _active_elements, _current_zoom_level, _get_zoom_level, _ignore_list, _schedule_scan;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (__hasProp.call(this, i) && this[i] === item) return i;
    }
    return -1;
  };
  root = this;
  _current_zoom_level = 1;
  _ignore_list = [];
  _active_elements = [];
  _active_controls = [];
  parsers = [];
  DefaultParser = (function() {
    function DefaultParser() {}
    DefaultParser.prototype._pattern = /([\.\-_][0-9])?@(1x)?\.[a-z]+$/i;
    DefaultParser.prototype.isValidFilename = function(filename) {
      return !!filename.match(this._pattern);
    };
    DefaultParser.prototype.zoomLevelsForFilename = function(filename) {
      var i, match, max, _results;
      match = filename.match(this._pattern);
      max = match[1] ? parseInt(match[1].slice(1), 10) : 2;
      _results = [];
      for (i = 1; 1 <= max ? i <= max : i >= max; 1 <= max ? i++ : i--) {
        _results.push(Math.pow(2, i - 1));
      }
      return _results;
    };
    DefaultParser.prototype.filenameForZoom = function(baseFilename, zoom) {
      var match;
      if (zoom === 1) {
        return baseFilename;
      } else {
        match = baseFilename.match(/(.+)@(.*?)\.([a-z]+)$/i);
        return match[1] + "@" + zoom + "x." + match[3];
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
      var conf, i, max, _results;
      conf = this._confForFilename(filename);
      max = conf.length > 1 ? typeof conf[1] === "number" ? conf[1] : conf.length : 2;
      _results = [];
      for (i = 1; 1 <= max ? i <= max : i >= max; 1 <= max ? i++ : i--) {
        _results.push(Math.pow(2, i - 1));
      }
      return _results;
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
          zoom_sfx = zoom === 1 ? "" : "@" + zoom + "x";
          return "" + parts[1] + zoom_sfx + "." + parts[4];
        }
      } else {
        return conf[zoom - 1];
      }
    };
    return StaticParser;
  })();
  RetinaControl = (function() {
    function RetinaControl(element, parser, is_image, url) {
      var init_size;
      this.element = element;
      this.parser = parser;
      this.is_image = is_image;
      this.url = url;
      this.complete = 0;
      this.width = 0;
      this.height = 0;
      this.zoom = 1;
      this.setImagePath(this.url);
      init_size = __bind(function(width, height) {
        this.width = width;
        this.height = height;
        return this.setZoom(_current_zoom_level);
      }, this);
      if (this.is_image && this.element.complete) {
        init_size(this.element);
      } else {
        this.cachePath(this.url, init_size);
      }
    }
    RetinaControl.prototype.setZoom = function(zoom) {
      var l, level, levels, path, _i, _len;
      if (this.is_image) zoom *= this.element.offsetWidth / this.width;
      levels = parser.zoomLevelsForFilename(this.url);
      level = levels.slice(-1)[0];
      for (_i = 0, _len = levels.length; _i < _len; _i++) {
        l = levels[_i];
        if (l >= zoom && l < level) level = l;
      }
      if (level === this.zoom) return;
      path = parser.filenameForZoom(level);
      this.cachePath(path, function() {
        if (this.is_image) {
          if (!this.element.getAttribute("width")) {
            this.element.setAttribute("width", this.width);
          }
          if (!this.element.getAttribute("height")) {
            this.element.setAttribute("height", this.height);
          }
        }
        return this.setImagePath(path);
      });
      return this.zoom = level;
    };
    RetinaControl.prototype.release = function() {
      return this.setZoom(1);
    };
    RetinaControl.prototype.setImagePath = function(url) {
      if (this.is_image) {
        return this.element.src = url;
      } else {
        return this.element.style['backgroundImage'] = "url(" + url + ")";
      }
    };
    RetinaControl.prototype.cachePath = function(url, callback) {
      var img;
      if (this.cached != null) this.cached = {};
      if (url in this.cached) return callback(this.cached[url]);
      img = new Image;
      img.addEventListener("load", function() {
        this.cached[url] = [img.naturalWidth, img.naturalHeight];
        return callback.apply(null, this.cached[url]);
      });
      return img.src = url;
    };
    return RetinaControl;
  })();
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
  _schedule_scan = (function() {
    var next;
    next = 0;
    return function(delay) {
      if (next) root.clearTimeout(next);
      if (delay >= 0) return next = root.setTimeout(scan, delay);
    };
  })();
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
    if (__indexOf.call(_ignore_list, element) >= 0) {
      _ignore_list.splice(ignore_list.indexOf(element), 1);
    }
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
  ignore_element = function(element) {
    var index;
    if (__indexOf.call(_active_elements, element) >= 0) {
      index = _active_elements.indexOf(element);
      _active_elements.splice(index, 1);
      _active_controls.splice(index, 1);
    }
    return _ignore_list.push(element);
  };
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
  root.addEventListener("load", function() {
    scan();
    return setInterval(function() {
      var control, zoom, _i, _len;
      zoom = _get_zoom_level();
      if (zoom !== _current_zoom_level) {
        _current_zoom_level = zoom;
        for (_i = 0, _len = _active_controls.length; _i < _len; _i++) {
          control = _active_controls[_i];
          control.setZoom(zoom);
        }
        return _schedule_scan(1);
      }
    }, 1000);
  });
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = retina;
  } else {
    this.retina = retina;
  }
}).call(this);
