const { imageHash } = require('image-hash')
const bits = 8

addEventListener('message', e => {
  imageHash(e.data, bits, true, (error, data) => {
    postMessage(data)
  })
})
