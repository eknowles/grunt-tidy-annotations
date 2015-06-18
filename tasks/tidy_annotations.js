/*
 * grunt-tidy-annotations
 *
 *
 * Copyright (c) 2015 Edward Knowles
 * Licensed under the MIT license.
 */

'use strict';

String.prototype.repeat = function (num) {
  return new Array(num + 1).join(this);
};

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

  var buildItemObject = function (item) {
    var re = /^((@[A-Z]+\\([a-zA-Z]+)\())(.*?)([\)|\s]+)?(,)?$/g;
    var m;
    var obj = {};
    while ((m = re.exec(item)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      var parents = m[5];
      if (parents) {
        obj.parents = parents.replace(/\s/g, '').length;
      }
      obj.hasChildren = m[6] ? true : false;
      obj.head = m[1];
      obj.body = m[4];
    }
    return obj;
  };

  var processComment = function processComment(str, indentString, annotationPrefix) {
    var m;
    var re = /(^@.*?)([\s|)]+$)/;
    if ((m = re.exec(str)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      var items = str
        .split(annotationPrefix)
        .filter(Boolean)
        .map(function (o) {
          return annotationPrefix + o;
        });
      var output = '';
      var indent = 1;
      console.log('=======');
      for (var i = 0; i < items.length; i++) {
        var itemObject = buildItemObject(items[i]);
        var item = '';
        var itemHead = indentString.repeat(indent) + itemObject.head + '\n';
        indent += 1;
        var itemBody = '';
        var kvCheck = /(\s+)?([a-z]+?)=(("")?(".+?")?(false|true)?([0-9]+)?)(,)?/gim;
        console.log(itemObject);
        if (kvCheck.test(itemObject.body)) {
          itemBody = itemObject.body.replace(kvCheck, indentString.repeat(indent) + '$2=$3$7\n');
        } else {
          console.warn(itemObject);
          itemBody = itemObject.body.replace(/(\n"(.+)?"(\)?))/g, '\n"$2"$3');
        }
        item = itemHead + itemBody;
        for (var y = itemObject.parents - 1; y >= 0; y--) {
          indent -= 1;
          if (y === 0 && itemObject.hasChildren) {
            item += '\n' + indentString.repeat(indent) + '),';
          } else {
            item += '\n' + indentString.repeat(indent) + ')';
          }
        }
        if (itemObject.hasChildren) {
          item = item.replace(/\n$/, ',\n');
        }
        output += item + '\n';
      }
      output = output.replace(/(\n\n)/g, '\n'); // remove empty lines
      return output;
    } else {
      return false;
    }
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
    output = block.replace(/(\n )/g, '\n' + ' '.repeat(initialIndent - 2) + ' *'); // add *
    output = output.replace(/(^\s+)@/, '/**\n' + ' '.repeat(initialIndent - 2) + ' * @'); // add leading /**
    output = output.replace(/$/g, ' '.repeat(initialIndent - 2) + ' */'); // add trailing */
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
      var cleaned = processComment(item, '  ', '@SWG');
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
