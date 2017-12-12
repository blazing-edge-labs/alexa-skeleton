const _ = require('lodash')
const Alexa = require('alexa-app').app

const amazonIntents = require('src/intents/amazon')
const handlers = require('src/handlers')
const helpers = require('src/utils/helpers')
const middleware = require('src/utils/middleware')

const {NODE_ENV} = process.env
const app = new Alexa()

_.assign(app, {
  error: handlers.error,
  launch: handlers.launch,
  post: handlers.post,
  pre: handlers.pre
})

app.intent(helpers.intents.AMAZON.help, amazonIntents.help)
app.intent(helpers.intents.AMAZON.stop, amazonIntents.stop)

// custom intents go here
const allCustomIntents = [{
  intentName: helpers.intents.giftIntent,
  intentFn: require('src/intents/gift'),
  validSlots: helpers.intentValidSlots.gift
}]

// register custom intents and wrap under the middleware function
_.forEach(allCustomIntents, function (customIntentData) {
  app.intent(customIntentData.intentName, middleware(
    customIntentData.intentFn,
    customIntentData.validSlots
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
