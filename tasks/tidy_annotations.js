/*
 * grunt-tidy-annotations
 *
 *
 * Copyright (c) 2015 Edward Knowles
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('tidy_annotations', 'Easily format PHP Swagger annotations with correct spaces', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {

      var sourceFiles = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      sourceFiles.forEach(function (filepath) {
        var destination = file.dest + filepath;
        var sourceCode = grunt.file.read(filepath);
        parseFile(sourceCode, function (cleaned) {
          sourceCode = cleaned;
        });

        // Write the destination file.
        grunt.file.write(destination, sourceCode);

        // Print a success message.
        grunt.log.writeln('File "' + destination + '" created.');

      });

    });
  });

  var processComment = function processComment(str, indentString) {
    var m;
    var re = /(^@.*?)(\)+$)/;
    if ((m = re.exec(str)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      var depth = m[2].length;
      var items = m[1].split('@');
      var indentCount = 1;
      var output = '';
      for (var i = 1; i < items.length; i++) {
        var indent;
        var lastItem = (i + 1 === items.length);
        if (i - 1 <= indentCount) {
          indent = i;
        } else {
          indent = depth;
        }
        if (indent === 0) {
          indentString = '';
        }
        indent = indentString.repeat(indent);
        var item = '@' + items[i];
        if (lastItem) {
          item = item + ')';
        }
        item = item.replace(/(\)[,]?$)/, '\n' + indent + '$1'); // fix last )
        item = item.replace(/(^@.+?)\(/, '\n' + indent + '$1(\n'); // fix first (
        // Key/Values

        var kvCheck = /([a-z]+?)=((".*?")?(false|true)?([0-9]+)?)(,?)/gim;
        if (kvCheck.test(item)) {
          item = item.replace(kvCheck, indent + indentString + '$1=$2$6\n'); // fix key=values
          //item = item.replace(/(^\s+)/gm, ''); // fix key=values
        } else {
          item = item.replace(/(\n"(.+)?"(\)?))/g, '\n' + indent + indentString + '"$2"$3');
        }

        output += item;
      }
      // add ending ) to tree
      for (var y = depth - 2; y >= 0; y--) {
        output += '\n' + indentString.repeat(y + 1) + ')';
      }
      output = output.replace(/(\n\n)/g, '\n'); // remove empty lines
      return output;
    } else {
      return false;
    }
  };

  String.prototype.repeat = function (num) {
    return new Array(num + 1).join(this);
  };

  var getMatches = function (regex, dataString) {
    var result = regex.exec(dataString);
    return result ? result : false;
  };

  var getIndent = function (preCleanString) {
    var re = /\n(\s*\*\/)/g;
    var m;
    var length = 0;
    while ((m = re.exec(preCleanString)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      length = m[1].length;
    }
    return length - 1;
  };

  var addStars = function (block, initialIndent) {
    var output;
    output = block.replace(/(\n )/g, '\n' + ' '.repeat(initialIndent - 2) + ' *');
    output = output.replace(/(^\n)/g, '/**\n'); // add leading /**
    output = output.replace(/$/g, '\n' + ' '.repeat(initialIndent - 2) + ' */'); // add trailing */
    return output;
  };

  var matchComments = function (docBlock) {
    var regex = /\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g;
    var clean = [];
    var dirty = [];
    var indentCapture = [];
    var match;
    while (match = getMatches(regex, docBlock)) {
      if (match) {
        dirty.push(match[0]);
        var stripped = match[0].replace(/(\/\*\*\n(\s*)\*|\n(\s*)\*) /g, '');
        indentCapture.push(getIndent(stripped));
        stripped = stripped.replace(/\n(\s*\*\/)/g, ''); // remove final *
        clean.push(stripped);
      }
    }
    clean.forEach(function (item, index) {
      var cleaned = processComment(item, '  ');
      if (cleaned) {
        clean[index] = cleaned;
        clean[index] = addStars(clean[index], indentCapture[index]);
      } else {
        clean[index] = dirty[index];
      }
      docBlock = docBlock.replace(dirty[index], clean[index]);
    });
    return docBlock;
  };

  var parseFile = function (dataString, callback) {
    var comments = matchComments(dataString);
    callback(comments);
  };

};
