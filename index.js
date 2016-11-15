'use strict';
const appRoot = require('app-root-path')
const pluginName = 'plugin-node-engine-extender'
const configPath = 'extensionPath'

const loadExtensions = (extPath) => {
  const extension = require(`${appRoot}/${extPath}`)
  if (!extension) {
    console.log('Extension failed to load')
    process.exit(1)
  }
  return extension
}

function onPatternIterate(patternlab) {
  const extension = patternlab.extension
  patternlab.patterns = patternlab.patterns.map((pattern) => {
    pattern.engine.engine = extension(pattern.engine.engine)
    return pattern;
  })
  return patternlab
}

function registerEvents(patternlab) {
  patternlab.events.on('patternlab-pattern-iteration-end', onPatternIterate)
}

/**
* A single place to define the frontend configuration
* This configuration is outputted to the frontend explicitly as well as included in the plugins object.
*
*/
function getPluginFrontendConfig() {
  return {
    'name':'pattern-lab\/' + pluginName,
  }
}

/**
* The entry point for the plugin. You should not have to alter this code much under many circumstances.
* Instead, alter getPluginFrontendConfig() and registerEvents() methods
  */
function pluginInit(patternlab) {
  if (!patternlab) {
    console.error('patternlab object not provided to plugin-init')
    process.exit(1)
  }
  const extPath = patternlab.config[configPath]
  if (!extPath) {
    console.log(`no extension path at config.${configPath}`)
    process.exit(1)
  }
  var pluginConfig = getPluginFrontendConfig()

  //add the plugin config to the patternlab-object
  if (!patternlab.plugins) {
    patternlab.plugins = []
  }
  patternlab.plugins.push(pluginConfig)

  //setup listeners if not already active
  if (patternlab.config.plugins[pluginName] !== undefined &&
      patternlab.config.plugins[pluginName].enabled &&
      !patternlab.config.plugins[pluginName].initialized) {

     //register events
     registerEvents(patternlab);

     //set the plugin initialized flag to true to indicate it is installed and ready
     patternlab.config.plugins[pluginName].initialized = true;
   }
}

module.exports = pluginInit
