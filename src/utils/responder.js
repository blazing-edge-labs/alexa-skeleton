const _ = require('lodash')

function responder (echoResponses, res) {
  _.forEach(echoResponses.say, function (audioResponses) {
    res.say(audioResponses)
  })

  if (echoResponses.directive) {
    res.directive(echoResponses.directive)
  }

  if (echoResponses.reprompt) {
    res.reprompt(echoResponses.reprompt)
  }

  return res.shouldEndSession(!!echoResponses.shouldEndSession).send()
}

module.exports = responder
