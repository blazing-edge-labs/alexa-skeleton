const _ = require('lodash')

const errors = require('src/utils/errors')
const handlers = require('src/handlers')
const helpers = require('src/utils/helpers')
const storeService = require('src/store')

// intents
const giftIntent = require('src/intents/gift')

// intents which are wrapped need to be included and mapped here
const intents = {
  giftIntent
}

function getProperIntentAndSlots (slots, validIntentNames) {
  const slotValues = _(slots).map('value').compact().value()
  const respSlots = {}
  let properIntent

  _.forEach(validIntentNames, function (validIntentName) {
    const validSlotsName = _.replace(validIntentName, 'Intent', '')

    if (!helpers.intentValidSlots[validSlotsName] || properIntent) {
      return
    }

    properIntent = validIntentName

    _.forEach(slotValues, function (slotValue) {
      _.map(helpers.intentValidSlots[validSlotsName], function (valuesOrFn, key) {
        if (helpers.isIncluded(valuesOrFn, slotValue) || (typeof valuesOrFn === 'function' && valuesOrFn(slotValue))) {
          respSlots[key] = slotValue
        }
      })
    })
  })

  return {properIntent, slots: respSlots}
}

function middleware (intentFn, validSlots = {}) {
  return function (req, res) {
    const store = storeService.init(req.getSession())

    if (!store) {
      return handlers.launch(req, res)
    }
    const intentName = _.get(req, 'data.request.intent.name')
    const allowedIntents = store.get('mainReducer.allowedIntents')

    if (_.includes(allowedIntents, intentName)) {
      const strippedSlots = helpers.stripSlots(req.slots)

      if (_.size(req.slots) && !helpers.areSlotsValid(strippedSlots, validSlots)) {
        return handlers.error(errors.invalidIntent, req, res)
      }

      return intentFn(req, res, store, strippedSlots)
    }

    const {properIntent, slots} = getProperIntentAndSlots(req.slots, allowedIntents)

    if (properIntent && !_.isEmpty(slots)) {
      return intents[properIntent](req, res, store, slots)
    }

    if (store.get('mainReducer.passAllowedIntentOnError')) {
      return intents[store.get('mainReducer.allowedIntents[0]')](req, res, store)
    }

    return handlers.error(errors.intentNotAllowed, req, res)
  }
}

module.exports = middleware
