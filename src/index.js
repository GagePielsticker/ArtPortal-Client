'use strict'

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

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

const createAppLoader = () => {
  // Create the loader window.
  loadingScreen = new BrowserWindow({
    width: loadingScreenConfig.width,
    height: loadingScreenConfig.height,
    frame: false,
    transparent: true
  })
  loadingScreen.setResizable(false)

  loadingScreen.loadURL(loadingScreenConfig.landing)

  // On closed null out loading screen
  loadingScreen.on('closed', () => (loadingScreen = null))

  // Once loading screen loads, show it
  loadingScreen.webContents.on('did-finish-load', () => {
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
      contextIsolation: false,
      },
    show: false // Do not show initially
  })

  //mainWindow.removeMenu() // hide toolbar
  mainWindow.setBackgroundColor(mainWindowConfig.backgroundColor) // set background color

  // and load the index.html of the app.
  mainWindow.loadFile(mainWindowConfig.landing)

  mainWindow.webContents.on('did-finish-load', () => { // Once we finish loading, close the loading screen, show main app
    if (loadingScreen) {
      loadingScreen.close()
    }
    mainWindow.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createAppLoader()
  createAppWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
