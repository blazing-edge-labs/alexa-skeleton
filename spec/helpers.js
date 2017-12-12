const _ = require('lodash')
const Speech = require('ssml-builder')

const app = require('index').app
const voiceResponses = require('src/responses')

function getStoreResp (resp) {
  return JSON.parse(_.get(resp, 'sessionAttributes.store'))
}

async function makeRequest (data) {
  let resp
  try {
    resp = await app.request(data)
  } catch (err) {
    console.error('Test request error!')
    console.error(err)
  }
  return {resp, store: getStoreResp(resp)}
}

function prepareNextRequest (intentName, slots, store) {
  return formatEchoRequest(intentName, slots, {store: JSON.stringify(store)})
}

function launchIntent () {
  // TODO change to some other intent
  return formatEchoRequest('giftIntent', {}, {}, true)
}

function testVoiceResponses (response, type = 'alexaText') {
  return voiceResponses(response, type, false)
}

function getSsmlResp (resp) {
  return _.get(resp, 'response.outputSpeech.ssml')
}

function formatTestResponse (resps) {
  if (typeof resps !== 'object') {
    return new Speech().say(resps).ssml()
  }

  let speech = new Speech()

  _.forEach(resps, function (response) {
    let type = response.type || 'say'

    if (type === 'audio') {
      speech.audio(response.speech)
    } else {
      speech.say(response.speech)
    }
  })

  return speech.ssml()
}

function formatEchoRequest (intentName, slots, attributes = {}, isNewSession = false, type = 'IntentRequest') {
  return {
    session: {
      sessionId: 'testsession',
      application: {
        applicationId: 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
      },
      attributes,
      user: {
        userId: 'amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2'
      },
      new: isNewSession
    },
    request: {
      type,
      requestId: 'amzn1.echo-api.request.6919844a-733e-4e89-893a-fdcb77e2ef0d',
      locale: 'en-US',
      timestamp: '2016-02-22T09:44:55Z',
      intent: {
        name: intentName,
        slots
      }
    },
    version: '1.0',
    context: {
      'System': {
        'user': {
          'userId': 'amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2'
        },
        'application': {
          'applicationId': 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
        },
        device: {
          'supportedInterfaces': {
            'AudioPlayer': {},
            'VideoApp': {},
            'Display': {}
          }
        }
      }
    }
  }
}

module.exports = {
  formatEchoRequest,
  formatTestResponse,
  getSsmlResp,
  launchIntent,
  makeRequest,
  prepareNextRequest,
  voiceResponses: testVoiceResponses
}
