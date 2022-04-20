'use strict'

module.exports = client => {
  client.db = require('electron-db')
  const path = require('path')
  const log = require('electron-log')

  const location = path.join(__dirname, '../../data')

  // If our images json file doesnt exist create it
  client.db.createTable('images', location, (succ, msg) => {
    log.info('Creating image table/jsonfile.')
    if (succ) return log.info('Successfully created table/jsonfile.')
    log.warn('Error creating table/jsonfile.')
    log.warn(msg)
  })

  // If our settings json file doesnt exist create it
  client.db.createTable('settings', location, (succ, msg) => {
    log.info('Creating settings/jsonfile.')

    if (succ) return log.info('Successfully created settings/jsonfile.')
    log.warn('Error creating settings/jsonfile.')
    log.warn(msg)
  })

  /**
   * Checks to see if database entry exist, if not create it then return issetupcomplete status
   * @returns <Promise> resolves if setup is complete, reject if not
   */
  client.isSetupComplete = () => {
    return new Promise((resolve, reject) => {
      log.info('Running isSetupComplete()')

      client.db.getField('settings', location, 'setupFinished', (succ, data) => {
        // If record doesnt exist, create it
        if (!succ) {
          log.warn('setupFinished does not exist, writing.')

          client.db.insertTableContent('settings', location, {
            setupFinished: false,
            currentDirectory: ''
          }, (succ, msg) => {
            if (succ) log.info('Inserted setupFinished Record.')
            else log.warn(`Failed to insert first boot record: ${msg}`)
          })
        } else {
          if (data[0]) return resolve() // Setup complete already
        }

        return reject()
      })
    })
  }

  client.isSetupComplete() // Will create a settings entry if record isnt there

  /**
   * Changes the entry of our setup status in the DB
   * @param {Boolean} status
   * @returns
   */
  client.changeSetupStatus = status => {
    return new Promise((resolve, reject) => {
      log.info('Running changeSetupStatus()')

      client.db.updateRow('settings', location, {}, { setupFinished: status }, (succ, msg) => {
        if (succ) {
          log.info('Successfully changed setupFinished status.')
          resolve()
        } else {
          log.warn(`Could not change setupFinished status: ${msg}`)
          reject()
        }
      })
    })
  }

  /**
   * Changes directory path saved
   * @param {String} path
   * @returns
   */
  client.changeDirectoryPath = path => {
    return new Promise((resolve, reject) => {
      log.info('Running changeDirectoryPath()')

      client.db.updateRow('settings', location, {}, { currentDirectory: path }, (succ, msg) => {
        if (succ) {
          log.info('Successfully changed current Directory.')
          resolve()
        } else {
          log.warn(`Could not change current Directory: ${msg}`)
          reject()
        }
      })
    })
  }

  //
}
