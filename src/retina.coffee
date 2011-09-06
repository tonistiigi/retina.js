
root = this

class DefaultParser
    # proposed format myimage@.png, myimage@2x.png, myimage-3@4x.png
    _pattern: /([\.\-_][0-9])?@(1x)?\.[a-z]+$/i
    
    isValidFilename: (filename) -> 
        !!filename.match @_pattern 

    zoomLevelsForFilename: (filename) ->
        match = filename.match @_pattern
        if match[1]
            parseInt match[1][1..], 10
        else
            2
        
    filenameForZoom: (baseFilename, zoom) ->
        if zoom == 1
            baseFilename
        else
            match = baseFilename.match /(.+)@(.*?)\.([a-z]+)$/i
            match[1] + "@" + Math.pow(2, zoom - 1) + "x." + match[3]
        
        
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
        if conf.length > 1
            # second param is number - this is the zoom level
            if typeof conf[1] == "number"
                conf[1]
            # count all the filenames in conf
            else
                conf.length
        else
            # default if only defined as string
            2
        
    filenameForZoom: (baseFilename, zoom) ->
        conf = @_confForFilename baseFilename
        filename = conf[0]
        if conf.length == 1 or conf.length > 1 and typeof conf[1] == "number"
            # make based on first filename
            if zoom == 1
                baseFilename
            else
                parts = baseFilename.match /(.+?)(@)?([0-9]+x)?\.([a-z]+$)/i
                zoom_sfx = if zoom == 1 then "" else "@" + (Math.pow 2, zoom-1) + "x"
                "#{parts[1]}#{zoom_sfx}.#{parts[4]}"
        else
            conf[zoom-1]

_current_zoom_level = 1
parsers = []

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
    for func in "isValidFilename zoomLevelsForFilename filenameForZoom".split(" ")
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

scan = ->
    
set_manual_mode = (manual=true) ->
    
activate_element = (element, url="", width=0, height=0) ->
    
ignore_element = (element) ->

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

#setup cycle for zoom changes

#setup cycle for propery changes 

# Make accessible to require() in node, global if directly lined in the browser
if module?.exports?
    module.exports = retina
else
    this.retina = retina
