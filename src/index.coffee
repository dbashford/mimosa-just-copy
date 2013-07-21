"use strict"

fs = require 'fs'

logger = require 'logmimosa'

config = require './config'

registration = (mimosaConfig, register) ->
  ext = mimosaConfig.extensions
  register ['remove', 'cleanFile'], 'init', _removeFileAndEndWorkflow, [mimosaConfig.copy.extensions..., ext.javascript...]
  register ['remove', 'cleanFile'], 'init', _removeExtensionFileAndEndWorkflow, [ext.css..., ext.template...]
  register ['add','update','buildFile','buildExtension'], 'read', _removeFilesFromWorkflow
  register ['add', 'update'], 'read', _checkForRemoveAllFiles, ext.templates
  register ['add','update','buildFile','buildExtension'], 'beforeWrite', _placeFilesIntoWorkflow

_removeFilesFromWorkflow = (mimosaConfig, options, next) ->
  return next() unless options.files
  numFiles = options.files.length
  return next() if numFiles is 0

  indices = []

  for file, i in options.files
    for folder in mimosaConfig.justCopy.folders
      if file.inputFileName.indexOf(folder) is 0
        indices.unshift i
        break

  for index in indices
    _removeFileFromWorkflow options, index

  next()

_removeFileFromWorkflow = (options, index) ->
  unless options.justCopyFiles
    options.justCopyFiles = []
  removed = options.files.splice index, 1
  options.justCopyFiles.push removed[0]

_placeFilesIntoWorkflow = (mimosaConfig, options, next) ->
  return next() unless options.justCopyFiles

  unless options.files
    options.files = []

  for copyFile in options.justCopyFiles
    copyFile.outputFileName = copyFile.inputFileName.replace mimosaConfig.watch.sourceDir, mimosaConfig.watch.compiledDir
    copyFile.outputFileText = copyFile.inputFileText
    options.files.push copyFile

  next()

_removeExtensionFileAndEndWorkflow = (mimosaConfig, options, next) ->
  found = false
  for folder, i in mimosaConfig.justCopy.folders
    if options.inputFile.indexOf(folder) is 0
      found = true
      break

  if found
    _removeFile mimosaConfig, options, options.inputFile, -> next(false)
  else
    next()

_removeFileAndEndWorkflow = (mimosaConfig, options, next) ->
  files = []
  for file, i in options.files
    for folder in mimosaConfig.justCopy.folders
      if file.inputFileName.indexOf(folder) is 0
        files.push file.inputFileName
        break

  return next() if files.length is 0

  i = 0
  done = =>
    next(false) if ++i is files.length

  for fileName in files
    _removeFile mimosaConfig, options, fileName, done

_removeFile = (mimosaConfig, options, fileName, cb) ->
  destFile = fileName.replace mimosaConfig.watch.sourceDir, mimosaConfig.watch.compiledDir
  fs.exists destFile, (exists) ->
    unless exists
      return cb()
    else
      fs.unlink destFile, (err) ->
        if err
          logger.error "Failed to delete file [[ #{destFile} ]]"
        else
          logger.success "Deleted file [[ #{destFile} ]]", options
        cb()

_checkForRemoveAllFiles = (mimosaConfig, options, next) ->
  if options.justCopyFiles
    options.files = []
  next()

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate