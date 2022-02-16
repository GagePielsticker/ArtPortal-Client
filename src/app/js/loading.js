const { ipcRenderer } = require('electron')

ipcRenderer.on('message', (event, data) => {
  document.getElementById('loadingText').innerHTML = data
  if (data == 'Downloading update') {
    document.getElementById('downloadProg').style.display = 'block'
    document.getElementById('downloadSpeed').style.display = 'block'
  }

  if (data == 'Update downloaded') {
    document.getElementById('downloadProg').style.display = 'none'
    document.getElementById('downloadSpeed').style.display = 'none'
  }
})

ipcRenderer.on('loadprog', (event, data) => {
  const val = data.replace('%', '')
  document.getElementById('downloadProg').value = val
})

ipcRenderer.on('downloadspeed', (event, data) => {
  document.getElementById('downloadSpeed').innerHTML = `${(parseFloat(data) / 125000 / 8).toFixed(2)} MB/s`
})
