"use strict"

exports.defaults = ->
  justCopy:
    paths:[]

exports.placeholder = ->
  """
  \t

    justCopy:     # Configuration for the just-copy module
      paths:[]    # List of file or folder paths, the contents of which Mimosa will only copy
                  # from the watch.sourceDir to the watch.compiledDir. Paths can be relative
                  # to watch.sourceDir or absolute.
  """

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsIsObject(errors, "justCopy config", config.justCopy)
    validators.ifExistsArrayOfMultiPaths(errors, "justCopy.paths", config.justCopy.paths, config.watch.sourceDir);
  errors
