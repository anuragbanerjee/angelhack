/**
    Copyright 2016 Team Batman (Devesh Singh, Akshay Chalana, AJ Banerjee, Chaitya Shah, and Daniel Jamrozik)
    Based on work by 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var storage = require('./storage'),
    textHelper = require('./textHelper');

var registerEventHandlers = function (eventHandlers, skillContext) {
    eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
        //if user said a one shot command that triggered an intent event,
        //it will start a new session, and then we should avoid speaking too many words.
        skillContext.needMoreHelp = false;
    };

    eventHandlers.onLaunch = function (launchRequest, session, response) {
        //Speak welcome message and ask user questions
        //based on whether there are players or not.
        storage.loadGame(session, function (currentGame) {
            var speechOutput = '',
                reprompt;
            if (currentGame.data.players.length === 0) {
                speechOutput += 'Diner, Let\'s start your order. What is the first item you would like to order?';
                reprompt = "Please tell me your first order item.";
            } else if (currentGame.isEmptyScore()) {
                speechOutput += 'Diner, '
                    + 'you have ordered ' + currentGame.data.players.length + ' item';
                if (currentGame.data.players.length > 1) {
                    speechOutput += 's';
                }
                speechOutput += '. You can modify the existing order, order another item, reset the whole order or exit. Which would you like?';
                reprompt = textHelper.completeHelp;
            } else {
                speechOutput += 'Diner, What can I do for you?';
                reprompt = textHelper.nextHelp;
            }
            response.ask(speechOutput, reprompt);
        });
    };
};
exports.register = registerEventHandlers;
