/**
 * Exposes localhost to the internet
 */
require('dotenv-safe').config()
const {HOST, PORT} = process.env
const ngrok = require('ngrok')

ngrok.connect(PORT, (err, url, webInterface) => {
  if (err) {
    throw err
  }

  console.log(`
    -------------------------------------------
    Status: online
    Forwarding: ${url} -> http://${HOST}:${PORT}
    Web Interface: ${webInterface}
    Endpoint for Alexa: ${url}
    -------------------------------------------\n
  `)
})
