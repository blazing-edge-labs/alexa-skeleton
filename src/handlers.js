const _ = require('lodash')

const createLogger = require('src/utils/log')
const helpers = require('src/utils/helpers')
const responder = require('src/utils/responder')
const storeService = require('src/store')
const voiceResponses = require('src/responses')
const {actions} = require('src/store/actions')

function error (err, req, res) {
  req.log.info(err)
  req.log.info(req.data.request)

  // custom reprompts could be added here

  responder({
    say: [voiceResponses('error', 'alexaRandom')]
  }, res)
}

function pre (req, res) {
  req.log = createLogger(_.get(req.getSession(), 'details.sessionId'))
}

async function post (req, res) {
  helpers.stripUnsupportedResponses(req, res)
}

function launch (req, res) {
  const store = storeService.create(req.getSession())

  store.multiDispatch([
    actions.main.updateAllowedIntents([helpers.intents.giftIntent])
  ])

  responder({
    say: [voiceResponses('launch')],
    reprompt: voiceResponses('launch')
  }, res)
}

module.exports = {
  error,
  pre,
  post,
  launch
}
