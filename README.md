
# Alexa skeleton

This skeleton will give you a jump start for Alexa development, from developing locally to testing on an actual device. If you ever developed for Alexa you found that transferring state from one request to the next requires stringifying and parsing objects. In this skeleton the skill state is represented with [redux](https://github.com/reactjs/redux), which allows a full view into the state of the skill at any time. Interacting with the redux store is explained in steps below. [Alexa app](https://github.com/alexa-js/alexa-app) is used to communicate with the device.

*While this can help you get started for developing skills for Alexa, it is still a work in progress and might change.*

## Code Structure
Top level folders:
- **bin** - contains all the executable files. The only file for now is the `ngrok.js`, used to expose the local server to the internet. This way the application can be used for testing instead of an aws lambda function
- **spec** - all the tests and test helpers
- **speechAssets** - contains all the `utterances`, `intentSchema` and all possible slots, which are separated into individual files
- **src** - contains the main skill code, used to run the actual skill. Subfolders are:
    - **intents** - all the custom intents and amazon intents
    - **templates** - holds all the templates for the directives
    - **store** - contains the store. A simple wrapper for the redux store, all the actions and reducers. You should write your actions and reducers here
    - **responses** - all responses for the devices. The `index.js` file holds the main function to get proper responses. This way it's easier to change later on and not worry if they will match in the tests
    - **utils** - contains all the utilities (helpers, responder, logger, errors)

### utils
The utils folder has some flavour functions which are rather important for the skeleton.
##### responder
This function formats the final response. Here is an example where we want to say two phrases, attach a directive and **not** end the current session:
```
  responder({
    say: [
        voiceResponses('gift.001'),
        voiceResponses('This is a literal response!', 'literal')
    ],
    directive: templates.backgroundImage('background.001'),
    reprompt: voiceResponses('gift.001')
  }, res)
```
The responder will concat the two voice responses into one, add the directive from the templates, add the proper reprompt and **not** end the session. The `gift.001` is a custom response defined in the `responses/alexa.js` file.
Here is another example where we would like to stop the session:
```
  responder({
    say: [voiceResponses('stop')],
    directive: templates.backgroundImage('stop'),
    shouldEndSession: true
  }, res)
```
Again the `stop` string is a custom response defined in the `responses/alexa.js` file.
#### helpers
Contains all the intent names and valid slots, along with some functions used throught the skill. An example is shown below:
```
const intents = {
  AMAZON: {
    helpIntent: 'AMAZON.HelpIntent',
    stopIntent: 'AMAZON.StopIntent'
  },
  // example gift intent
  giftIntent: 'giftIntent'
}
const intentValidSlots = {
  // example for a "giftIntent", which has a slot "giftName"
  gift: {
    giftName: ['candy', 'toy', 'chocolate']
  }
}
```
The *middleware* function uses the `intentValidSlots` to check if the values are correct.

#### middleware
If you developed a skill which uses the same slots for different intents and would like the end user to follow a specific path, then this is the function to use. To use this function make sure your slot values (if any) are defined before in the `intentValidSlots`. How does it work?

The *middleware* parameters are:
- **intent name** - this is used to map to the proper intent later on
- **intent function**
- **valid intent slots** - all the slots and possible values for the slots. An example slot can be found in the `src/utils/helpers.js`

Using the store you define which intents should be called next. An example, where we want to trigger the gift intent and not some other similar intent which has the same utterances:
```
store.dispatch(actions.main.updateAllowedIntents([helpers.intents.giftIntent]))
```
*A note here! You should never limit the user! This is just branching, if the user wants to reset the skill or stop you need to allow this. Also remember that Alexa can put values which are not part of your defined slots and this function will error out if the value is not predefined.*

All the intents wrapped with the `middleware` function need to be included in the intents object on line 12. In the example below we just have the `giftIntent`.
```
const intents = {
  giftIntent
}
```

## Development
Run locally:
```
HOST=localhost PORT=3000 npm run dev
```
*The HOST and PORT variables are only needed locally, so there was no point in adding them to the .env.example*
Expose the local environment with ngrok:
```
HOST=localhost PORT=3000 npm run dev:expose
```
*You need to use the same HOST and PORT variables with which you started the application*

Run tests:
```
NODE_ENV=test npm test
```

Build the application for production
```
docker run -v "$(pwd)":/var/task lambci/lambda:build-nodejs6.10 npm i && npm run prod:build
```

## Acknowledgements
Huge thanks to Rocket insights for helping setup this amazing thing. If you need to refresh your knowdlege on setting up an Alexa skill and how things work, check it out at [Rocket insights alexa workshop](https://github.com/rocketinsights/alexa-workshop)  :)
