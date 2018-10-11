parser = require './parser'
fs = require 'fs'

compile = (filePath) ->
  try
    parseTree = parser.parse fs.readFileSync filePath, 'utf8'

    if parseTree?
      console.plog parseTree
      console.log "\nCompiled!"

      result =
        success: true,
        parserTree: parseTree
      return result
    else
      console.error "Parse error due to incomplete source file!"

      result =
        success: false,
        parserTree: parseTree
      return result
  catch error
    console.error error

    result =
      success: false,
      parserTree: null
    return result

uncompile = (filePath) -> console.log "Uncompiled!"
run = (d2module) -> console.log "Running d2 module!"

module.exports =
  compile: compile
  uncompile: uncompile
  run: run
