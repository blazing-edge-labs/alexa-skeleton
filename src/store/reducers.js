const _ = require('lodash')
const {combineReducers} = require('redux')

const {actionTypes} = require('src/store/actions')

const mainReducerInitialState = {
  allowedIntents: []
}

function mainReducer (state = mainReducerInitialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_ALLOWED_INTENTS:
      return _.assign({}, state, {...action.data})
    default:
      return state
  }
}

const giftReducerInitialState = {
  giftName: null
}

function giftReducer (state = giftReducerInitialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_GIFT_NAME:
      return _.assign({}, state, {...action.data})
    default:
      return state
  }
}

const appReducer = combineReducers({
  mainReducer,
  giftReducer
})

function appReducerWrapper (state, action) {
  if (action.type === actionTypes.RESET_ALL) {
    state = undefined
  }

  return appReducer(state, action)
}

module.exports = appReducerWrapper
