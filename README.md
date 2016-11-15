# Pattern Engine Extender for Pattern Lab Node

The Pattern Engine Extender allows Pattern Lab Node users to extend the pattern engine. 

## Installation

To add the plugin to your project using npm type:

  npm install plugin-node-engine-extender --save

Or add it directly to your project's `package.json` file and run `npm install`

## Configuration

The plugin expects a config file to be available to import from a path specified in the patternlab config like this:

config
```json
 {
   "extensionPath": "ROOT_PATH/to/your/extensions.js",
 }
```

extensions.js
```js
const helpers = {
  join: function (arr, seperator = ',') {
    if (arr && arr.length > 0) {
      return arr.join(seperator)
    }
  }
}

// Takes a Pattern Engine as an argument, modifies, and returns it.
const applyHelpers = (engine) => {
  for (let key in helpers) {
    if (helpers[key]) {
      engine.registerHelper(key, helpers[key])
    }
  }
  return engine
}

module.exports = applyHelpers
```
