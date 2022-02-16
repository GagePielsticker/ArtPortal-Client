'use strict'

module.exports = async client => {
  client.db = require('electron-db')
  const path = require('path')
  const log = require('electron-log')

  const location = path.join(__dirname, '../../data')

  //If our images json file doesnt exist create it
  client.db.createTable('images', location, (succ, msg) => {
    log.info('Creating image table/jsonfile.')
    
    if(succ) {
      log.info('Successfully created table/jsonfile.')
    } else {
      log.warn('Error creating table/jsonfile.')
      log.warn(msg)
    }
  })

  //If our settings json file doesnt exist create it
  client.db.createTable('settings', location, (succ, msg) => {
    log.info('Creating settings/jsonfile.')

    if(succ) {
      log.info('Successfully created settings/jsonfile.')
    } else {
      log.warn('Error creating settings/jsonfile.')
      log.warn(msg)
    }
  })

  // MD5 String, tags array - adds tags to md5 entry
  client.updateTags = async (md5hash, tags) => {

  }

  // Get tags from a specific md5 hash
  client.getTags = async (md5hash) => {

  }

  //client.updateTags("1", ["test", "test2"])
}
