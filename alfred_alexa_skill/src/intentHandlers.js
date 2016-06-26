/**
    Copyright 2016 Team Batman (Devesh Singh, Akshay Chalana, AJ Banerjee, Chaitya Shah, and Daniel Jamrozik)
    Based on work by 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var storage = require('./storage');

var registerIntentHandlers = function (intentHandlers, skillContext) {

    intentHandlers.AddNameToOrder = function (intent, session, response) {
        var ordername = intent.slots.username.value;

        var speechOutput,reprompt;
        speechOutput = 'Hi ' + ordername + '. Please go ahead with your order';

        storage.loadOrder(session, function (currentOrder) {

            currentOrder.data.currentDiner = ordername;
            if(currentOrder.data.order[ordername] == undefined) {

                currentOrder.data.ordername.push(ordername);
                currentOrder.data.order[ordername] = {};
                currentOrder.data.placed[ordername] = 'No';
            }
            else{

            }
            currentOrder.save(function () {
                response.ask(speechOutput);
            });
         });
    };

    intentHandlers.AddToOrder = function (intent, session, response) {
        //give a player points, ask additional question if slot values are missing.

        var item = intent.slots.item.value;
        var quantity = intent.slots.quantity.value;
        if (isNaN(quantity)) {
            quantity = 1;
        }
        var speechOutput,reprompt;
        storage.loadOrder(session, function (currentOrder) {

            var ordername  = currentOrder.data.currentDiner;
            var order =  currentOrder.data.order[ordername];

            if(item in order){
                order[item] = parseInt(order[item]) + parseInt(quantity);
            }
            else{
                order[item] = parseInt(quantity);
            }

            currentOrder.data.order[ordername] = order;
            speechOutput  = quantity + ' ' + item + ' ordered. ' + 'Anything Else?';

            currentOrder.save(function () {
                response.ask(speechOutput);
            });
    });

    };

    intentHandlers.ResetOrderIntent = function (intent, session, response) {

        storage.loadOrder(session, function (currentOrder) {

            var ordername  = intent.slots.username.value;
            if (ordername == undefined ){
                ordername = currentOrder.data.currentDiner;
            }
            currentOrder.data.order[ordername] = {};
             var speechOutput,reprompt;
            speechOutput  = 'Order cleared for ' + ordername + '. Please order again' ;

            currentOrder.save(function () {
                response.ask(speechOutput);
            });
        });
    };

     intentHandlers.InBetweenOrderIntent = function (intent, session, response) {

        storage.loadOrder(session, function (currentOrder) {

            currentOrder.data.currentDiner = '';

            var speechOutput = 'Okay next in line please. Welcome Sir, how may I help you';
            var reprompt;
            currentOrder.save(function () {
                response.ask(speechOutput);
            });
        });
    };

    intentHandlers.RepeatOrderIntent = function (intent, session, response) {

        storage.loadOrder(session, function (currentOrder) {

            var ordername  = intent.slots.username.value;
            var orderJSON= currentOrder.data.order[ordername];
            var order = '';
            for (var item in orderJSON) {
                order = order + ' ' + orderJSON[item] + ' ' + item;
            }
            response.tell(order);

        });
    };

    intentHandlers.NoIntent = function (intent, session, response) {

        storage.loadOrder(session, function (currentOrder) {

            var ordername  = currentOrder.data.currentDiner;
            currentOrder.data.placed[ordername] = 'Yes';

            var speechOutput  = 'Order finished for ' + ordername + '. Should I place the order?' ;
            currentOrder.save(function () {
                response.ask(speechOutput);
            });
        });
    };

    intentHandlers.YesIntent = function (intent, session, response) {

        storage.loadOrder(session, function (currentOrder) {

            var ordername  = currentOrder.data.currentDiner;

           /* var orderindex = currentOrder.data.ordername.indexOf(ordername);
            currentOrder.data.ordername.splice(orderindex, 1);

            delete currentOrder.data.order[ordername];
            delete currentOrder.data.placed[ordername]; */


            var speechOutput  = 'Order finished for ' + ordername + '. You will receive your order shortly.' ;
             var reprompt;
            currentOrder.save(function () {

                    response.tell(speechOutput);
            });
        });
    };
    intentHandlers.ResetWholeIntent = function (intent, session, response) {
        //remove all players
        storage.newOrder(session).save(function () {
            response.tell('Every order cleared.');
        });


};

};


exports.register = registerIntentHandlers;
