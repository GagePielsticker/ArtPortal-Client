module.exports = client => {
  const alertLengthSeconds = 8
  /**
   * Warning box
   * @param {String} str Text to display
   */
  client.fn.warn = str => {
    client.log.info(`Warn executing: ${str}`)
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

  /**
   * Hashes images via worker
   * @param {String} str File path of image to hash
   * @returns Hash string
   */
  client.fn.hashImage = str => {
    return new Promise((resolve, reject) => {
      client.hashWorker.postMessage(str)

      client.hashWorker.onmessage = ({ data }) => {
        resolve(data)
      }
    })
  }
}
