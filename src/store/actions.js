const actionTypes = {
  RESET_ALL: 'RESET_ALL',
  // main
  UPDATE_ALLOWED_INTENTS: 'UPDATE_ALLOWED_INTENTS',

  // gift
  UPDATE_GIFT_NAME: 'UPDATE_GIFT_NAME'
}

const main = {
  updateAllowedIntents: function (allowedIntents) {
    return {
      type: actionTypes.UPDATE_ALLOWED_INTENTS,
      data: {
        allowedIntents
      }
    }
  }
}

// example gift action
const gift = {
  setGiftName: function (giftName) {
    return {
      type: actionTypes.UPDATE_GIFT_NAME,
      data: {
        giftName
      }
    }
  }
}

const actions = {
  main,
  gift
}

module.exports = {
  actions,
  actionTypes
}
