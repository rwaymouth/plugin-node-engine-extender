# Pattern Engine Extender for Pattern Lab Node

The Pattern Engine Extender allows Pattern Lab Node users to extend the pattern engine. Currently it is only configured to apply handlebars helpers, but that may change in the future.

## Installation

To add the plugin to your project using npm type:

  npm install plugin-node-tab --save

Or add it directly to your project's `package.json` file and run `npm install`

## Configuration

The plugin expects a config file to be available to import from a path specified in the patternlab config like this:

```json
 {
   "extensionPath": "ROOT_PATH/to/your/extensions",
 }
```
