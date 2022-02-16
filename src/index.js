'use strict'

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')

// Global setup
let loadingScreen

const loadingScreenConfig = {
  width: 300,
  height: 500,
  landing: 'file://' + __dirname + '/loading/index.html'
}

const mainWindowConfig = {
  width: 1280,
  height: 720,
  backgroundColor: '#2C2F33',
  landing: './src/app/index.html'
}

log.info('=====================================')
log.info(`App started on version: ${app.getVersion}`)

const createAppLoader = () => {
  // Create the loader window.
  loadingScreen = new BrowserWindow({
    width: loadingScreenConfig.width,
    height: loadingScreenConfig.height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    transparent: true
  })

  loadingScreen.setResizable(false)

  loadingScreen.loadURL(loadingScreenConfig.landing)

  // On closed null out loading screen
  loadingScreen.on('closed', () => (loadingScreen = null))

  // Once loading screen loads, show it
  loadingScreen.webContents.on('did-finish-load', () => {
    log.info('Loaded Updater.')
    loadingScreen.show()
  })
}

const createAppWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: mainWindowConfig.width,
    height: mainWindowConfig.height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false // Do not show initially
  })

  // mainWindow.removeMenu() // hide toolbar
  mainWindow.setBackgroundColor(mainWindowConfig.backgroundColor) // set background color

  // and load the index.html of the app.
  mainWindow.loadFile(mainWindowConfig.landing)

  mainWindow.webContents.on('did-finish-load', () => { // Once we finish loading, close the loading screen, show main app
    if (loadingScreen) {
      loadingScreen.close()
    }
    log.info('Loaded Main Windows, closing updater.')
    mainWindow.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  log.info('Electron Initialized.')

  createAppLoader() // Create loading & update checking window
  autoUpdater.checkForUpdates()

  autoUpdater.on('checking-for-update', () => {
    if (loadingScreen) {
      loadingScreen.webContents.send('message', 'Checking for updates') // Message the window to alert user
    }
  })

  autoUpdater.on('update-available', () => {
    if (loadingScreen) {
      loadingScreen.webContents.send('message', 'Downloading update')
    }
    log.info('Update available. Downloading...')
  })

  autoUpdater.on('download-progress', progressObj => {
    if (loadingScreen) {
      loadingScreen.webContents.send('loadprog', `${progressObj.percent}`)
      loadingScreen.webContents.send('downloadspeed', `${progressObj.bytesPerSecond}`)
    }
  })

  autoUpdater.on('update-downloaded', () => {
    if (loadingScreen) {
      loadingScreen.webContents.send('message', 'Update downloaded')
    }
    log.info('Downloaded update.')
    autoUpdater.quitAndInstall()
  })

  autoUpdater.on('before-quit-for-update', () => {
    if (loadingScreen) {
      loadingScreen.webContents.send('message', 'Installing update')
    }
    log.info('Restarting application to install.')
  })

  autoUpdater.on('update-not-available', () => {
    log.info('No update available.')
    if (loadingScreen) {
      loadingScreen.webContents.send('message', 'Loading app')
    }
    createAppWindow()
  })

  autoUpdater.on('error', e => {
    log.warn(`COULD NOT LOAD UDPATES: ${e}`)
    createAppWindow()
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createAppWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
