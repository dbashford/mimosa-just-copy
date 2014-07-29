"use strict"

exports.defaults = ->
  justCopy:
    paths:[]

exports.placeholder = ->
  """
  \t

    justCopy:     # Configuration for the just-copy module
      paths:[]    # Can be either a list of file or folder paths or an object with src dest attributes:
                  #   {
                  #     src: "some/relative/src"
                  #     dest: "some/relative/dest"
                  #   }
                  #
                  # The contents of this array will only be copied
                  # from the watch.sourceDir to the watch.compiledDir. Paths can be relative
                  # to watch.sourceDir or absolute.
  """

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsIsObject(errors, "justCopy config", config.justCopy)
    for path in config.justCopy.paths
      if typeof path is "object"
        validators.ifExistsIsString(errors, "justCopy.paths:src", path.src)
        validators.ifExistsIsString(errors, "justCopy.paths:dest", path.dest)
      else
        validators.ifExistsIsString(errors, "justCopy.paths", path)
  errors
