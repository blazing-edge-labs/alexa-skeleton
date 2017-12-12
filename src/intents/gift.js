const responder = require('src/utils/responder')
const voiceResponses = require('src/responses')
const {actions} = require('src/store/actions')

function gift (req, res, store) {
  const slot = req.slot('giftName')

  store.dispatch(actions.gift.setGiftName(slot))

  responder({
    say: [voiceResponses('gift.001')]
  }, res)
}

module.exports = gift
