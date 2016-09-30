'use strict';
const appRoot = require('app-root-path')
const NodeESModuleLoader = require('node-es-module-loader')
const loader = new NodeESModuleLoader()

const pluginName = 'plugin-node-tab'
const configPath = 'extensionPath'

const applyHelpers = (engine, extensions) => {
  for (let key in extensions) {
    if (extensions[key]) {
      engine.registerHelper(key, extensions[key])
    }
  }
  return engine
}

const loadExtensions = (extPath) => {
  let extension
  try {
    extension = Promise.resolve(require(`${appRoot}/${extPath}`))
  } catch (e) {
    extension = loader.import(`${appRoot}/${extPath}`).then((module) => module.default)
  }

  return extension
}

function onPatternIterate(patternlab) {
  const extPath = patternlab.config[configPath]
  if (!extPath) {
    console.log(`no extension path at config.${configPath}`)
    process.exit(1)
  }
  const getExtensions = loadExtensions(extPath).catch((err) => {
    console.log(`extensions not found at ${extPath}`)
    console.log('ERROR:', err)
  })
  return getExtensions.then((extensions) => {
    patternlab.patterns = patternlab.patterns.map((pattern) => {
      pattern.engine.engine = applyHelpers(pattern.engine.engine, extensions)
      return pattern;
    })
    return patternlab
  })
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
  var pluginConfig = getPluginFrontendConfig()

  //add the plugin config to the patternlab-object
  if (!patternlab.plugins) {
    patternlab.plugins = []
  }
  patternlab.plugins.push(pluginConfig)

  //setup listeners if not already active
  if (patternlab.config[pluginName] !== undefined && !patternlab.config[pluginName]) {

    //register events
    registerEvents(patternlab);

    //set the plugin key to true to indicate it is installed and ready
    patternlab.config[pluginName] = true;
  }

}

module.exports = pluginInit
