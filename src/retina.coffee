
class DefaultParser
    isValidFilename: (filename) -> 

    zoomLevelsForFilename: (filename) ->
        
    filnameForZoom: (baseFilename, zoom) -> 
        
class StaticParser
    constructor: (@conf) ->
        
    isValidFilename: (filename) -> 

    zoomLevelsForFilename: (filename) ->
        
    filnameForZoom: (baseFilename, zoom) -> 

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
