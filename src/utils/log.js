function log (sessionId) {
  function error (err) {
    console.error('SessionId:', sessionId)
    console.error(new Date(), err)
  }

  function info (msg) {
    console.log('SessionId:', sessionId)
    console.log(new Date(), msg)
  }

  return {error, info}
}

module.exports = log
