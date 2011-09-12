
root = this

_current_zoom_level = 1
_ignore_list = []

_active_elements = []
_active_controls = []

parsers = []


class DefaultParser
    # proposed format myimage@.png, myimage@2x.png, myimage-3@4x.png
    _pattern: /([\.\-_][0-9])?@(1x)?\.[a-z]+$/i
    
    isValidFilename: (filename) -> 
        !!filename.match @_pattern 

    zoomLevelsForFilename: (filename) ->
        match = filename.match @_pattern
        max = if match[1] then parseInt match[1][1..], 10 else 2
        Math.pow 2, i-1 for i in [1..max]
        
    filenameForZoom: (baseFilename, zoom) ->
        if zoom == 1
            baseFilename
        else
            match = baseFilename.match /(.+)@(.*?)\.([a-z]+)$/i
            match[1] + "@" + zoom + "x." + match[3]
        
        
class StaticParser
    constructor: (@conf=[]) ->
    
    _confForFilename: (filename) ->
        for conf in @conf
            conf = [conf] if typeof conf == "string"
            return conf if filename.match new RegExp "#{conf[0]}$"
        null
    
    isValidFilename: (filename) -> 
        !!@_confForFilename filename

    zoomLevelsForFilename: (filename) ->
        conf = @_confForFilename filename
        max = if conf.length > 1
            # second param is number - this is the zoom level
            if typeof conf[1] == "number"
                conf[1]
            # count all the filenames in conf
            else
                conf.length
        else
            # default if only defined as string
            2
        Math.pow 2, i-1 for i in [1..max]

    filenameForZoom: (baseFilename, zoom) ->
        conf = @_confForFilename baseFilename
        filename = conf[0]
        if conf.length == 1 or conf.length > 1 and typeof conf[1] == "number"
            # make based on first filename
            if zoom == 1
                baseFilename
            else
                parts = baseFilename.match /(.+?)(@)?([0-9]+x)?\.([a-z]+$)/i
                zoom_sfx = if zoom == 1 then "" else "@" + zoom + "x"
                "#{parts[1]}#{zoom_sfx}.#{parts[4]}"
        else
            conf[zoom-1]

class RetinaControl
    constructor: (@element, @parser, @is_image, @url) ->
        @complete = 0
        @width = 0
        @height = 0
        @zoom = 1

        @setImagePath @url

        init_size = (@width, @height) =>
            @setZoom _current_zoom_level
        
        if @is_image and @element.complete then init_size @element.naturalWidth, @element.naturalHeight
        else @cachePath @url, init_size
        

    setZoom: (zoom) ->
        if @is_image
            zoom *= @element.offsetWidth / @width
        
        levels = @parser.zoomLevelsForFilename @url
        [level] = levels[-1..]
        for l in levels
            level = l if l>=zoom and l<level

        return if level == @zoom
        
        path = @parser.filenameForZoom @url, level
        
        @cachePath path, =>
            if @is_image
                @element.setAttribute "width", @width unless @element.getAttribute "width"
                @element.setAttribute "height", @height unless @element.getAttribute "height"
            @setImagePath path
                
        #todo: size fixing
        
        @zoom = level
        
    release: ->
        @setZoom 1

    setImagePath: (url) ->
        if @is_image
            @element.src = url
        else
            @element.style['backgroundImage'] = "url(#{url})"

    cachePath: (url, callback) ->
        @cached ?= {}
        return callback @cached[url] if url of @cached
        
        img = new Image
        img.addEventListener "load", => 
            @cached[url] = [img.naturalWidth, img.naturalHeight]
            console.log @cached[url]
            callback @cached[url]...
        img.src = url


_get_zoom_level = ->
    userAgent = root.navigator?.userAgent
    
    # Only Webkit based browsers currently supported
    if root.window and userAgent.match /Webkit/i
        # Mobile browsers
        (if userAgent.match /Mobile/i
            screenWidth =   if root.orientation in [0, 180]
                                root.screen.width
                            else 
                                root.screen.height
            if root.devicePixelRatio
                screenWidth *= root.devicePixelRatio
        else
            root.document.width
        ) / root.window.innerWidth
    else
        1

add_parser = (parser) ->
    for func in "isValidFilename zoomLevelsForFilename filenameForZoom".split " "
        if typeof parser[func] != "function"
            throw "Invalid parser object. No method #{func} found."

    parsers.push parser
    #todo: schedule next scan

remove_parser = (parser) ->
    if parser in parsers
        index = parsers.indexOf parser
        parsers.splice index, 1
        #todo: clear all controls that are already active and using this parser

clear_parsers = ->
    remove_parser parsers[0] while parsers.length
    return
    
set_parser = (parser) ->
    if parsers.length != 1 or parsers[0] != parser
        clear_parsers()
        add_parser parser

_schedule_scan = do -> 
    next = 0
    (delay) ->
        root.clearTimeout next if next
        next = root.setTimeout scan, delay if delay >= 0

scan = ->
    if root.document?.querySelectorAll
        for element in root.document.querySelectorAll "img[src],*[style*='background-image']"
            if element in _ignore_list then continue
            if element not in _active_elements
                activate_element element
        _schedule_scan 3000


set_manual_mode = (manual=true) ->
    
activate_element = (element, url="") ->    
    return if element in _active_elements
    _ignore_list.splice (ignore_list.indexOf element), 1 if element in _ignore_list
    
    is_image = element instanceof root.HTMLImageElement
    
    url or= if is_image then element.src else element.style['backgroundImage'].match(/url\((.+)\)/)[1]
    
    for parser in parsers
        if parser.isValidFilename url
            control = new RetinaControl element, parser, is_image, url
            _active_controls.push control
            _active_elements.push element
            return true
    false

ignore_element = (element) ->
    if element in _active_elements
        index = _active_elements.indexOf element
        _active_elements.splice index, 1
        _active_controls.splice index, 1
    _ignore_list.push element

retina =
    allParsers: -> parsers.slice()
    addParser: add_parser
    removeParser: remove_parser
    clearParsers: clear_parsers
    setParser: set_parser
    scan: scan
    setManualMode: set_manual_mode

    activateElement: activate_element    
    ignoreElement: ignore_element

    DefaultParser: DefaultParser
    StaticParser: StaticParser

# Export some private method on dev verions
# so the functionality can be tested
if not RELEASE_MODE?
    retina._get_zoom_level = _get_zoom_level



retina.addParser new DefaultParser

root.addEventListener "load", ->

    scan()

    setInterval ->
            zoom = _get_zoom_level()
            if zoom != _current_zoom_level
                _current_zoom_level = zoom
                for control in _active_controls
                    control.setZoom zoom
                _schedule_scan 1
        , 1000


# Make accessible to require() in node, global if directly lined in the browser
if module?.exports?
    module.exports = retina
else
    this.retina = retina
