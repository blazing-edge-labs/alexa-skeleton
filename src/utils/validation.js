const _ = require('lodash')

const errors = require('src/utils/errors')
const handlers = require('src/handlers')
const helpers = require('src/utils/helpers')

function isIncluded (values, slotValue) {
  return _.find(values, function (value) {
    return helpers.normalize(value) === helpers.normalize(slotValue)
  })
}

function stripSlots (slots) {
  const slotKeys = _.keys(slots)
  const respSlots = {}

  _.forEach(slotKeys, function (slotKey) {
    respSlots[slotKey] = slots[slotKey].value
  })

  return respSlots
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

function validation (intentFn, validSlots = {}) {
  return function (req, res, store) {
    const reqSlots = stripSlots(req.slots)

    if (_.size(validSlots) && _.size(reqSlots) && !areSlotsValid(reqSlots, validSlots)) {
      return handlers.error(errors.invalidIntentSlots, req, res)
    }

    return intentFn(req, res, store)
  }
}

module.exports = validation
