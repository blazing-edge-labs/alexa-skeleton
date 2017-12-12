const _ = require('lodash')
const redux = require('redux')

const reducers = require('src/store/reducers')

function init (session) {
  if (!session || !session.get('store')) {
    return false
  }

  const store = redux.createStore(reducers, JSON.parse(session.get('store')))

  function dispatch (action, shouldUpdateSession = true) {
    store.dispatch(action)

    if (shouldUpdateSession) {
      updateSession()
    }
  }

  function multiDispatch (actions, shouldUpdateSession = true) {
    _.forEach(actions, function (action) {
      dispatch(action, shouldUpdateSession)
    })
  }

  function get (property) {
    return _.get(store.getState(), property)
  }

  function json () {
    return store.getState()
  }

  function updateSession () {
    session.set('store', JSON.stringify(store.getState()))
  }

  return {
    dispatch,
    multiDispatch,
    get,
    json,
    updateSession
  }
}

function create (session) {
  session.set('store', JSON.stringify(redux.createStore(reducers).getState()))
  return init(session)
}

module.exports = {
  create,
  init
}
