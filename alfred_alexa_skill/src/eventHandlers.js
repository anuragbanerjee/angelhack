/**
    Copyright 2016 Team Batman (Devesh Singh, Akshay Chalana, AJ Banerjee, Chaitya Shah, and Daniel Jamrozik)
    Based on work by 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var storage = require('./storage');
0
var registerEventHandlers = function (eventHandlers, skillContext) {
    eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
        //if user said a one shot command that triggered an intent event,
        //it will start a new session, and then we should avoid speaking too many words.
        //skillContext.needMoreHelp = false;
    };

    eventHandlers.onLaunch = function (launchRequest, session, response) {
        //Speak welcome message.
            var speechOutput = 'Okay, We are ready for ordering. What is your name?';
            response.ask(speechOutput);
           // var ordername = 'Test';
           // currentOrder.data.currentDiner = ordername;
           // currentOrder.data.ordername.push(ordername);
           // currentOrder.data.order[ordername] = ordername;
           // currentOrder.data.placed[ordername] = ordername;
            speechOutput = 'Initial Saved';
            currentOrder.save(function () {
                 response.tell(speechOutput);
            });
    };
};
exports.register = registerEventHandlers;
