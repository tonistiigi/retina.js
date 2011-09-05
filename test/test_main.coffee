[retina, nodeunit] = 
    if typeof require == 'function'
        [(require "../lib/retina"), require "nodeunit"]
    else 
        [this.retina, this.nodeunit]

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

    "Parsers management": nodeunit.testCase 
        setUp: (callback) ->
            callback()

        tearDown: (callback) ->
            #reset to default configuration
            retina.setParser new retina.DefaultParser
            callback()

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

        "Adding valid parser": (test) ->
            sp = new retina.StaticParser []
            retina.addParser sp
            test.strictEqual retina.allParsers().length, 2, "Parsers count did not increment after add"
            test.ok sp in retina.allParsers(), "Added parser not found in parsers array"
            test.done()

        "Forbid simple push to parsers array": (test) ->
            parsers = retina.allParsers()
            num_parsers = parsers.length
            parsers.push new retina.StaticParser []
            test.strictEqual retina.allParsers().length, num_parsers
            test.done()

        "Clear deletes all parsers": (test) ->
            test.notEqual retina.allParsers().length, 0, "There should be parsers before clear"
            retina.clearParsers()
            test.strictEqual retina.allParsers().length, 0, "All parsers were not removed"
            test.done()

        "SetParser adds only one": (test) ->
            retina.addParser new retina.StaticParser []
            dp1 = new retina.DefaultParser
            retina.setParser dp1
            parsers = retina.allParsers()
            test.strictEqual parsers.length, 1
            test.strictEqual parsers[0], dp1

            dp2 = new retina.DefaultParser
            retina.setParser dp2
            parsers = retina.allParsers()
            test.strictEqual parsers.length, 1
            test.strictEqual parsers[0], dp2

            test.done()

        "Deleting parsers individually": (test) ->
            retina.clearParsers()
            retina.addParser dp1 = new retina.DefaultParser
            retina.addParser sp1 = new retina.StaticParser []
            retina.addParser sp2 = new retina.StaticParser []

            retina.removeParser sp1
            test.strictEqual retina.allParsers().length, 2
            test.ok dp1 in retina.allParsers()
            test.ok sp2 in retina.allParsers()

            retina.removeParser new retina.DefaultParser
            test.strictEqual retina.allParsers().length, 2, "Deleting unused parser should not change active parsers"
            test.ok dp1 in retina.allParsers()
            test.ok sp2 in retina.allParsers()

            retina.removeParser dp1
            test.strictEqual retina.allParsers().length, 1
            test.ok sp2 in retina.allParsers()

            test.done()

        "Forbid directly deleting parsers from array": (test) ->
            retina.addParser dp = new retina.DefaultParser
            parsers = retina.allParsers()
            num_parsers = parsers.length
            parsers.splice parsers.length - 1, 1
            test.strictEqual retina.allParsers().length, num_parsers
            test.done()

if module?.exports?
    module.exports = test_main
else
    this.test_main = test_main
