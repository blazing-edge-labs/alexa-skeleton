const responder = require('src/utils/responder')
const templates = require('src/templates')
const voiceResponses = require('src/responses')
const {actions} = require('src/store/actions')

function gift (req, res, store) {
  const slot = req.slot('giftName')

  store.dispatch(actions.gift.setGiftName(slot))

  responder({
    say: [voiceResponses('gift.001')],
    directive: templates.backgroundImage('background.001')
  }, res)
}

module.exports = gift
