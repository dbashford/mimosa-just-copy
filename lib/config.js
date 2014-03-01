"use strict";
exports.defaults = function() {
  return {
    justCopy: {
      paths: []
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  justCopy:     # Configuration for the just-copy module\n    paths:[]    # List of file or folder paths, the contents of which Mimosa will only copy\n                # from the watch.sourceDir to the watch.compiledDir. Paths can be relative\n                # to watch.sourceDir or absolute.";
};

exports.validate = function(config, validators) {
  var errors;
  errors = [];
  if (validators.ifExistsIsObject(errors, "justCopy config", config.justCopy)) {
    validators.ifExistsArrayOfMultiPaths(errors, "justCopy.paths", config.justCopy.paths, config.watch.sourceDir);
  }
  return errors;
};
