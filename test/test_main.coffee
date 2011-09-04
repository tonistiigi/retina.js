retina = if typeof require == 'function' then require "../lib/retina" else this.retina

test_main =
    "retina is present": (test) ->
        test.ok retina
        test.strictEqual "object", typeof retina
        test.done()

    "some basic functions are present": (test) ->
        functions = "addParser allParsers removeParser clearParsers setParser scan setManualMode activateElement ignoreElement"
        for name in functions.split " "
            test.ok retina?[name],  "Missing retina.#{name}"
            test.strictEqual "function", typeof retina?[name], "retina.#{name} is not a function"
        test.done()

    "allParsers() return array": (test) ->
        test.ok retina.allParsers() instanceof Array
        test.done()

if module?.exports?
    module.exports = test_main
else
    this.test_main = test_main
