'use strict'

module.exports = async client => {

  // MD5 String, tags array - adds tags to md5 entry
  client.updateTags = async (md5hash, tags) => {

  }

  // Get tags from a specific md5 hash
  client.getTags = async (md5hash) => {

  }

  client.updateTags("1", ["test", "test2"])
}
