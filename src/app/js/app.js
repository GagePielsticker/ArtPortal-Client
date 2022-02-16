'use strict'

module.exports = client => {

    //Sometimes client does not load in time so we scan it until it exist then start the app
    let checkInterval = setInterval(() => {
        if(client != null) loadApp()
    }, 10)

    async function loadApp() {
        clearInterval(checkInterval) //Stop our loop

        await client.isSetupComplete()
        .then(() => {
           // setup is complete, ignore
        })
        .catch(() => {
           //setup is incomplete, run setup
        })
    }
}