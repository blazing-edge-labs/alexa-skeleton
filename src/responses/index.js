const _ = require('lodash')
const Speech = require('ssml-builder')

const alexaResponses = require('src/responses/alexa')
const errors = require('src/utils/errors')
const fnResponses = require('src/responses/fnResponses')

function processor (responseText, type = 'alexaText', processSsml = true) {
  const speech = new Speech()
  let responseArray

  function getProperResponse () {
    if (type === 'function') {
      return function (input) {
        return speech.say(fnResponses[responseText](input)).ssml(true)
      }
    }

    switch (type) {
      case 'alexaText':
        return _.get(alexaResponses, responseText)
      case 'alexaRandom':
        responseArray = _.get(alexaResponses, responseText)
        return responseArray[_.random(0, _.size(responseArray) - 1)]
      case 'literal':
        return responseText
      default:
        return 'What we have here is a failure to communicate'
    }
  }

  const finalResponse = getProperResponse()

  if (!finalResponse) {
    throw errors.sayNotProvided
  }

  if (processSsml) {
    switch (type) {
      case 'alexaText':
      case 'alexaRandom':
      case 'literal':
        return speech.say(finalResponse).ssml(true)
    }
  }

  return finalResponse
}

module.exports = processor
