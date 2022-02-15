module.exports = async client => {

    var Datastore = require('nedb')
    client.db = new Datastore({ filename: './src/data.db'});

    client.db.loadDatabase(err => { 
        //IF NULL ERROR ERROR ERROR
    })



    //MD5 String, tags array - adds tags to md5 entry
    client.updateTags = (md5hash, tags) => {
        return new Promise((res, rej) => {
            client.db.update({md5hash}, {
                md5hash,
                $push: { tags: { $each: tags } } 
            }, {upsert: true})
            .then(res)
            .catch(rej)
        })
    }

    //Get tags from a specific md5 hash
    client.getTags = (md5hash) => {
        return new Promise((res, rej) => {
            client.db.findOne({md5hash})
            .then(res)
            .catch(rej)
        })
    }
}