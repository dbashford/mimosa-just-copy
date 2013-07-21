"use strict";
exports.defaults = function() {
  return {
    justCopy: {
      folders: []
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # justCopy:       # Configuration for the just-copy module\n    # folders:[]    # List of folder paths, the contents of which Mimosa will only copy from the\n                    # watch.sourceDir to the watch.compiledDir. Folder paths can be relative to\n                    # watch.sourceDir or absolute.";
};

exports.validate = function(config, validators) {
  var errors;
  errors = [];
  if (validators.ifExistsIsObject(errors, "justCopy config", config.justCopy)) {
    validators.ifExistsArrayOfMultiPaths(errors, "justCopy.folders", config.justCopy.folders, config.watch.sourceDir);
  }
  return errors;
};
