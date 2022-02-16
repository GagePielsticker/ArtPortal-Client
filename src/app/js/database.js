'use strict'

module.exports = client => {
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

  /**
   * Check to see if the user has completed setup
   * @returns <Promise> resolves if setup is complete, reject if not
   */
  client.isSetupComplete = () => {
    return new Promise((resolve, reject) => {
      log.info('Running isSetupComplete()')

      client.db.getField('settings', location, 'setupFinished', (succ, data) => {

        //If record doesnt exist, create it
        if(!succ) {
          log.warn('setupFinished does not exist, writing.')
          
          client.db.insertTableContent('settings', location, { setupFinished: false}, (succ, msg) => {
            if(succ) log.info('Inserted setupFinished Record.')
            else log.warn(`Failed to insert first boot record: ${msg}`)
          })

        } else {
          if(data[0]) return resolve() //Setup complete already
        }

        return reject()
      })
    })
  }

  /**
   * Changes the entry of our setup status in the DB
   * @param {Boolean} status 
   * @returns 
   */
  client.changeSetupStatus = status => {
    return new Promise((resolve, reject) => {
      log.info('Running changeSetupStatus()')

      client.db.updateRow('settings', location, {setupFinished : false}, {setupFinished: status}, (succ, msg) => {
        if(succ) {
          log.info('Successfully changed setupFinished status.')
          resolve()
        }
        else {
          log.warn(`Could not change setupFinished status: ${msg}`)
          reject()
        }
      })

    })
  }

}
