'use strict'

module.exports = client => {
  // Sometimes client does not load in time so we scan it until it exist then start the app
  const log = require('electron-log')
  const hashWorker = new Worker('./js/hash_worker.js', { type: 'module' })

  const imageArray = []
  const hashArray = []


  const checkInterval = setInterval(() => {
    if (client != null) loadApp()
  }, 5)

  async function loadApp () {
    clearInterval(checkInterval) // Stop our loop

    // Check if setup is complete
    await client.isSetupComplete()
      .then(() => {
        log.info('Setup is complete, continuing...')
      })
      .catch(() => {
        log.info('Setup incomplete, loading setup screen')
        document.getElementById('setup').classList.remove('d-none') // If not reveal intro cover
      })

    const alertLengthSeconds = 8

    // Our warn alert
    function warn (str) {
      const alert = document.getElementById('warningAlert')
      alert.innerHTML = str
      alert.classList.remove('d-none')
      setTimeout(() => {
        alert.classList.add('animate__fast')
        alert.classList.add('animate__fadeOutUp')
        setTimeout(() => {
          alert.classList.add('d-none')
          alert.classList.remove('animate__fast')
          alert.classList.remove('animate__fadeOutUp')
        }, 800)
      }, alertLengthSeconds * 1000)
    }

    // On intro cover next button hit
    document.getElementById('stage1NextButton').addEventListener('click', () => {
      const stage1 = document.getElementById('setupStage1')
      const stage2 = document.getElementById('setupStage2')

      stage1.classList.add('animate__fast')
      stage1.classList.add('animate__fadeOut') // fade out stage1, dispaly none, then fade in stage 2

      setTimeout(() => {
        stage1.classList.add('d-none')
        stage2.classList.remove('d-none')
      }, 800)
    })

    //On stage 2 button click
    document.getElementById('stage2NextButton').addEventListener('click', () => {
      const folderSel = document.getElementById('folderSelect')

      // Check to make sure file field is populated
      if (folderSel.files.length == 0) {
        return warn('No input folder given.')
      }

      //store to global array, calculate hashes on second array
      let hashedSuccessful = 0

      for (let i = 0; i < folderSel.files.length; i++) { //For each item in the FileStore
        let file = folderSel.files.item(i)
        let path = file.path

        let extension = path.split('.')[path.split('.').length - 1]

        if(
          extension == 'png'
          || extension == 'jpg'
          || extension == 'gif'
          || extension == 'jpeg'
        ) {
          imageArray.push(file.path) // Push to our file array if its a png,jpg,gif,or jpeg
        }
      }

      // Done filtering files
      let setupDiv = document.getElementById('setup')
      setupDiv.classList.add('animate__fast')
      setupDiv.classList.add('animate__fadeOutUp')
      setTimeout(() => {
        setupDiv.classList.add('d-none')
      }, 800)

      client.changeSetupStatus(true)
      //TODO client.changeImageDirectory(path)
    })
  }
}

// Image hash getter example
// hashWorker.postMessage(file.path)

// hashWorker.onmessage = ({ data }) => {
//   hashArray.push(data)
// }