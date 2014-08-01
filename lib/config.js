"use strict";
exports.defaults = function() {
  return {
    justCopy: {
      paths: []
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  justCopy:     # Configuration for the just-copy module\n    paths:[]    # Can be either a list of file or folder paths or an object with src dest attributes:\n                #   {\n                #     src: \"some/relative/src\"\n                #     dest: \"some/relative/dest\"\n                #   }\n                #\n                # The contents of this array will only be copied\n                # from the watch.sourceDir to the watch.compiledDir. Paths can be relative\n                # to watch.sourceDir or absolute.";
};

exports.validate = function(config, validators) {
  var errors, path, _i, _len, _ref;
  errors = [];
  if (validators.ifExistsIsObject(errors, "justCopy config", config.justCopy)) {
    _ref = config.justCopy.paths;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      path = _ref[_i];
      if (typeof path === "object") {
        validators.ifExistsIsString(errors, "justCopy.paths:src", path.src);
        validators.ifExistsIsString(errors, "justCopy.paths:dest", path.dest);
      } else {
        validators.ifExistsIsString(errors, "justCopy.paths", path);
      }
    }
  }
  return errors;
};
