retina = if typeof require == 'function' then require "../lib/retina" else this.retina

test_main =
    "retina is present": (test) ->
        test.ok retina
        test.strictEqual "object", typeof retina
        test.done()

    "Some basic functions are present": (test) ->
        functions = "addParser allParsers removeParser clearParsers setParser scan setManualMode activateElement ignoreElement"
        for name in functions.split " "
            test.ok retina?[name],  "Missing retina.#{name}"
            test.strictEqual "function", typeof retina?[name], "retina.#{name} is not a function"
        test.done()

    "allParsers() returns array": (test) ->
        test.ok retina.allParsers() instanceof Array
        test.done()

    "DefaultParser is added automatically": (test) ->
        parsers = retina.allParsers()
        test.strictEqual parsers.length, 1, "Parsers array doesn't contain one object"
        test.ok parsers[0] instanceof retina.DefaultParser, "Default parser is not instance of DefaultParser"
        test.done()

    "Adding invalid parser": (test) ->
        test.throws (-> retina.addParser()), "Invalid parser should throw"
        test.done()

    

if module?.exports?
    module.exports = test_main
else
    this.test_main = test_main
