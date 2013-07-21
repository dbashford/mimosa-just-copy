"use strict"

exports.defaults = ->
  justCopy:
    folders:[]

exports.placeholder = ->
  """
  \t

    # justCopy:       # Configuration for the just-copy module
      # folders:[]    # List of folder paths, the contents of which Mimosa will only copy from the
                      # watch.sourceDir to the watch.compiledDir. Folder paths can be relative to
                      # watch.sourceDir or absolute.
  """

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsIsObject(errors, "justCopy config", config.justCopy)
    validators.ifExistsArrayOfMultiPaths(errors, "justCopy.folders", config.justCopy.folders, config.watch.sourceDir);
  errors
