const _ = require('lodash')
const tape = require('tape')

const test = {}

function echoDevice () {
  const cb = _.last(arguments)

  tape(..._.initial(arguments), async function (test) {
    await cb(test)
    test.end()
  })
}

function only () {
  const cb = _.last(arguments)

  tape.only(..._.initial(arguments), async function (test) {
    await cb(test)
    test.end()
  })
}

test.app = echoDevice
test.app.only = only

module.exports = test
