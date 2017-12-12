const tests = require('test')
const helpers = require('spec/helpers')

tests.app('It should respond with the gift intent', async function (test) {
  const slots = {
    giftName: {
      name: 'giftName',
      value: 'toy'
    }
  }

  let response = await helpers.makeRequest(helpers.launchIntent())
  let {resp, store} = await helpers.makeRequest(helpers.prepareNextRequest(
    'giftIntent',
    slots,
    response.store
  ))

  const alexaResp = helpers.formatTestResponse([{
    type: 'say',
    speech: helpers.voiceResponses('gift.001')
  }])

  test.is(helpers.getSsmlResp(resp), alexaResp, 'The responses should be equal')
  test.is(slots.giftName.value, store.giftReducer.giftName, 'The store should have the proper value set')
})
