
class DefaultParser
    # proposed format myimage@.png, myimage@2x.png, myimage-3@4x.png
    _pattern: /([\.\-_][0-9])?@(([0-9])+x)?\.[a-z]+$/i
    
    isValidFilename: (filename) -> 
        !!filename.match @_pattern 

    zoomLevelsForFilename: (filename) ->
        match = filename.match @_pattern
        if match[1]
            parseInt match[1..], 10
        else
            2
        
    filnameForZoom: (baseFilename, zoom) ->
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
            if conf[1] == "number"
                conf[1]
            # count all the filenames in conf
            else
                conf.length
        else
            # default if only defined as string
            2
        
    filnameForZoom: (baseFilename, zoom) -> 
        conf = @_confForFilename baseFilename
        filename = conf[0]
        if conf.length == 1 or conf.length > 1 and typeof conf[1] == "number"
            # make based on first filename
            if zoom == 1
                baseFilename
            else
                parts = baseFilename.match /(.+)\.([a-z]+$)/i
                zoom_sfx = if zoom == 1 then "" else "@" + Math.pow 2, zoom-1
                "#{parts[1]}#{zoom_sfx}.#{parts[2]}"
        else
            conf[zoom-1]

parsers = []

calc_zoom_level = -> 

add_parser = (parser) ->
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
        clear_parsers
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

retina.addParser new DefaultParser

#setup cycle for zoom changes

#setup cycle for propery changes 

# Make accessible to require() in node, global if directly lined in the browser
if module?.exports?
    module.exports = retina
else
    this.retina = retina
