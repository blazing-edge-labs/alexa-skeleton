const _ = require('lodash')

const intents = {
  AMAZON: {
    helpIntent: 'AMAZON.HelpIntent',
    stopIntent: 'AMAZON.StopIntent'
  },
  // example gift intent
  giftIntent: 'giftIntent'
}

function stripUnsupportedResponses (req, res) {
  if (!_.get(req, 'context.System.device.supportedInterfaces.Display')) {
    _.set(res, 'response.response.directives', [])
  }
}

function normalize (value) {
  return _.replace(value, / /g, '-')
}

const intentValidSlots = {
  // example for a "giftIntent", which has a slot "giftName"
  gift: {
    giftName: ['candy', 'toy', 'chocolate']
  }
}

module.exports = {
  intents,
  intentValidSlots,
  normalize,
  stripUnsupportedResponses
}
