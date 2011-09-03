retina = if typeof require == 'function' then require "../lib/retina" else this.retina

test_main =
  "retina is present": (test) ->
    test.ok retina
    test.done()


if module?.exports?
    module.exports = test_main
else
    this.test_main = test_main
