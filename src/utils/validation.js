const _ = require('lodash')

const errors = require('src/utils/errors')
const handlers = require('src/handlers')
const helpers = require('src/utils/helpers')

function validation (intentFn, validSlots = {}) {
  return function (req, res, store) {
    const reqSlots = helpers.stripSlots(req.slots)

    if (_.size(validSlots) && _.size(reqSlots) && !helpers.areSlotsValid(reqSlots, validSlots)) {
      return handlers.error(errors.invalidIntentSlots, req, res)
    }

    return intentFn(req, res, store)
  }
}

module.exports = validation
