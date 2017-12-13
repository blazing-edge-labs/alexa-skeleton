const responder = require('src/utils/responder')
const templates = require('src/templates')
const voiceResponses = require('src/responses')

function help (req, res) {
  responder({
    say: [voiceResponses('help')]
  }, res)
}

function stop (req, res) {
  responder({
    say: [voiceResponses('stop', 'alexaRandom')],
    directive: templates.backgroundImage('stop'),
    shouldEndSession: true
  }, res)
}

module.exports = {
  help,
  stop
}
