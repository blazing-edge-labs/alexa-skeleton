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

function isIncluded (values, slotValue) {
  return _.find(values, function (value) {
    return normalize(value) === normalize(slotValue)
  })
}

function areSlotsValid (slots, validSlots) {
  let slotIsValid = false
  let slotKeys = _.keys(slots)

  for (let i = 0; i < _.size(slotKeys); i++) {
    let slotName = slotKeys[i]

    if (isIncluded(validSlots[slotName], slots[slotName]) ||
      (typeof validSlots[slotName] === 'function' && validSlots[slotName](slots[slotName]))
    ) {
      slotIsValid = true
      break
    }
  }

  return slotIsValid
}

function stripSlots (slots) {
  const slotKeys = _.keys(slots)
  const respSlots = {}

  _.forEach(slotKeys, function (slotKey) {
    respSlots[slotKey] = slots[slotKey].value
  })

  return respSlots
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
  areSlotsValid,
  intents,
  intentValidSlots,
  isIncluded,
  normalize,
  stripSlots,
  stripUnsupportedResponses
}
