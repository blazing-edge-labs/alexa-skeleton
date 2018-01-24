const _ = require('lodash')
const Alexa = require('alexa-app').app

const amazonIntents = require('src/intents/amazon')
const handlers = require('src/handlers')
const helpers = require('src/utils/helpers')
const storeWrapper = require('src/utils/store')
const validation = require('src/utils/validation')

const {NODE_ENV} = process.env
const app = new Alexa()

app.error = handlers.error
app.post = handlers.post
app.pre = handlers.pre

app.launch(handlers.launch)
app.intent(helpers.intents.AMAZON.helpIntent, amazonIntents.help)
app.intent(helpers.intents.AMAZON.stopIntent, amazonIntents.stop)

// custom intents go here
const allCustomIntents = [{
  intentName: helpers.intents.giftIntent,
  intentFn: require('src/intents/gift'),
  validSlots: helpers.intentValidSlots.gift
}]

// register custom intents
// run validation
// add the store
_.forEach(allCustomIntents, function (customIntentData) {
  app.intent(customIntentData.intentName, storeWrapper(
    validation(customIntentData.intentFn, customIntentData.validSlots)
  ))
})

if (NODE_ENV === 'development') {
  const express = require('express')
  const expressApp = express()

  const {HOST, PORT} = process.env

  app.express({
    expressApp,
    endpoint: '/',
    debug: true
  })
  expressApp.listen(PORT, HOST, function () {
    console.log(`
      App listening on ${HOST}:${PORT}
    `)
  })
}

exports.app = app
// The handler is used by aws lambda
exports.handler = app.lambda()
