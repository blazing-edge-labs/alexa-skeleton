const responder = require('src/utils/responder')
const voiceResponses = require('src/responses')

function help (req, res) {
  responder({
    say: [voiceResponses('help')]
  }, res)
}

function stop (req, res) {
  responder({
    say: [voiceResponses('stop', 'alexaRandom')],
    shouldEndSession: true
  }, res)
}

module.exports = {
  help,
  stop
}
