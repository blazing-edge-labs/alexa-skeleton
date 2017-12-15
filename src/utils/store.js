const handlers = require('src/handlers')
const storeService = require('src/store')

function storeWrapper (intentFn) {
  return function (req, res) {
    const store = storeService.init(req.getSession())

    if (!store) {
      return handlers.launch(req, res)
    }

    return intentFn(req, res, store)
  }
}

module.exports = storeWrapper
