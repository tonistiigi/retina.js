
class DefaultParser
    isValidFilename: (filename) -> 

    zoomLevelsForFilename: (filename) ->
        
    filnameForZoom: (baseFilename, zoom) -> 
        
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

clear_parsers = ->
    
set_parser = (parser) ->

scan = ->
    
set_manual_mode = (manual=true) ->
    
activate_element = (element, url="", width=0, height=0) ->
    
ignore_element = (element) ->

retina =
    parsers: parsers
    
    addParser: add_parser
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
