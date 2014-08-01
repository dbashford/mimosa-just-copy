"use strict";
var config, fs, logger, registration, _, _checkForRemoveAllFiles, _placeFilesIntoWorkflow, _removeExtensionFileAndEndWorkflow, _removeFile, _removeFileAndEndWorkflow, _removeFileFromWorkflow, _removeFilesFromWorkflow,
  __slice = [].slice;

fs = require('fs');

_ = require('underscore');

config = require('./config');

logger = null;

registration = function(mimosaConfig, register) {
  var ext;
  logger = mimosaConfig.log;
  ext = mimosaConfig.extensions;
  register(['remove', 'cleanFile'], 'init', _removeFileAndEndWorkflow, __slice.call(mimosaConfig.copy.extensions).concat(__slice.call(ext.javascript)));
  register(['remove', 'cleanFile'], 'init', _removeExtensionFileAndEndWorkflow, __slice.call(ext.css).concat(__slice.call(ext.template)));
  register(['add', 'update', 'buildFile', 'buildExtension'], 'read', _removeFilesFromWorkflow);
  register(['add', 'update'], 'read', _checkForRemoveAllFiles, ext.templates);
  return register(['add', 'update', 'buildFile', 'buildExtension'], 'beforeWrite', _placeFilesIntoWorkflow);
};

_removeFilesFromWorkflow = function(mimosaConfig, options, next) {
  var dest, entry, file, folder, i, index, indices, numFiles, src, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
  if (!options.files) {
    return next();
  }
  numFiles = options.files.length;
  if (numFiles === 0) {
    return next();
  }
  indices = [];
  _ref = options.files;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    file = _ref[i];
    _ref1 = mimosaConfig.justCopy.paths;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      entry = _ref1[_j];
      folder = _.isString(entry) ? entry : entry.src;
      if (file.inputFileName.indexOf(folder) !== -1) {
        indices.unshift(i);
        break;
      }
    }
  }
  for (_k = 0, _len2 = indices.length; _k < _len2; _k++) {
    index = indices[_k];
    src = entry.src ? mimosaConfig.watch.sourceDir + "/" + entry.src : mimosaConfig.watch.sourceDir;
    dest = entry.dest ? mimosaConfig.watch.compiledDir + "/" + entry.dest : mimosaConfig.watch.compiledDir;
    _removeFileFromWorkflow(options, index, src, dest);
  }
  return next();
};

_removeFileFromWorkflow = function(options, index, src, dest) {
  var removed;
  if (!options.justCopyFiles) {
    options.justCopyFiles = [];
  }
  removed = options.files.splice(index, 1);
  return options.justCopyFiles.push({
    copyFile: removed[0],
    src: src,
    dest: dest
  });
};

_placeFilesIntoWorkflow = function(mimosaConfig, options, next) {
  var copyFile, dest, entry, oldFilename, src, _i, _len, _ref;
  if (!options.justCopyFiles) {
    return next();
  }
  if (!options.files) {
    options.files = [];
  }
  _ref = options.justCopyFiles;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    entry = _ref[_i];
    copyFile = entry.copyFile, src = entry.src, dest = entry.dest;
    oldFilename = copyFile.inputFileName;
    copyFile.outputFileName = copyFile.inputFileName.replace(src, dest);
    logger.debug("Moving " + oldFilename + " to " + copyFile.outputFileName);
    copyFile.outputFileText = copyFile.inputFileText;
    options.files.push(copyFile);
  }
  return next();
};

_removeExtensionFileAndEndWorkflow = function(mimosaConfig, options, next) {
  var folder, found, i, _i, _len, _ref;
  found = false;
  _ref = mimosaConfig.justCopy.paths;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    folder = _ref[i];
    if (options.inputFile.indexOf(folder) === 0) {
      found = true;
      break;
    }
  }
  if (found) {
    return _removeFile(mimosaConfig, options, options.inputFile, function() {
      return next(false);
    });
  } else {
    return next();
  }
};

_removeFileAndEndWorkflow = function(mimosaConfig, options, next) {
  var done, file, fileName, files, folder, i, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
  files = [];
  _ref = options.files;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    file = _ref[i];
    _ref1 = mimosaConfig.justCopy.paths;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      folder = _ref1[_j];
      if (file.inputFileName.indexOf(folder) === 0) {
        files.push(file.inputFileName);
        break;
      }
    }
  }
  if (files.length === 0) {
    return next();
  }
  i = 0;
  done = (function(_this) {
    return function() {
      if (++i === files.length) {
        return next(false);
      }
    };
  })(this);
  _results = [];
  for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
    fileName = files[_k];
    _results.push(_removeFile(mimosaConfig, options, fileName, done));
  }
  return _results;
};

_removeFile = function(mimosaConfig, options, fileName, cb) {
  var destFile;
  destFile = fileName.replace(mimosaConfig.watch.sourceDir, mimosaConfig.watch.compiledDir);
  return fs.exists(destFile, function(exists) {
    if (!exists) {
      return cb();
    } else {
      return fs.unlink(destFile, function(err) {
        if (err) {
          logger.error("Failed to delete file [[ " + destFile + " ]]");
        } else {
          logger.success("Deleted file [[ " + destFile + " ]]", options);
        }
        return cb();
      });
    }
  });
};

_checkForRemoveAllFiles = function(mimosaConfig, options, next) {
  if (options.justCopyFiles) {
    options.files = [];
  }
  return next();
};

module.exports = {
  registration: registration,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
