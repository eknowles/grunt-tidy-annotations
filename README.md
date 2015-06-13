# grunt-tidy-annotations

> Easily format PHP Swagger annotations with correct spaces

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-tidy-annotations --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-tidy-annotations');
```

## The "tidy_annotations" task

### Overview
In your project's Gruntfile, add a section named `tidy_annotations` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  tidy_annotations: {
    main: {
      files: {
        'tmp/': '**/*.php'
      }
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 Edward Knowles. Licensed under the MIT license.
