mimosa-just-copy
===========

## Overview

A module that will copy assets without running them through the rest of Mimosa's module code.

For more information regarding Mimosa, see http://mimosa.io

Note: This module is compatible with Mimosa `0.14.0` and above.

## Usage

Add `'just-copy'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

## Functionality

Any folders (or files) added to `justCopy.paths` will be copied from the `watch.sourceDir` to the `watch.compiledDir` without any other Mimosa code effecting it.  No compiling, no linting, etc.

## Default Config

```javascript
justCopy: {
  paths:[]
}
```

* `paths`: Can be either a list of file or folder paths or an object with `src`/`dest` attributes. The contents of `paths` will only be copied from the `watch.sourceDir` to the `watch.compiledDir`. Paths can be relative to `watch.sourceDir` or absolute.

## Example Config

```javascript
justCopy : {
  "just/copy/this/whereMimosaWantsToCopyIt"
  {
    src: "but/copy/this",
    dest: "someplace/specific"
  }
}
```