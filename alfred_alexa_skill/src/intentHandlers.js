/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var storage = require('./storage');

var registerIntentHandlers = function (intentHandlers, skillContext) {
    

    intentHandlers.StartOrder = function (intent, session, response) {
        var speechOutput = 'Okay, start by telling your name';
        response.tell(speechOutput);
    };

    intentHandlers.AddNameToOrder = function (intent, session, response) {
        var ordername =intent.slots.username.value;
        var speechOutput;    
        speechOutput = 'Hi ' + ordername + '. Please go ahead with your order';
        storage.loadOrder(session, function (currentOrder) {
            currentOrder.data.currentDiner = ordername;
            currentOrder.data.ordername.push(ordername);
            currentOrder.data.order[ordername] = '';
            currentOrder.data.placed[ordername] = 'No';
            currentOrder.save(function () {           
                 response.tell(speechOutput);
            });
         });
    };

    intentHandlers.AddToOrder = function (intent, session, response) {
        //give a player points, ask additional question if slot values are missing.
       
        var item = intent.slots.item.value;
        var quantity = parseInt(intent.slots.quantity.value);
        var speechOutput;
        storage.loadOrder(session, function (currentOrder) {
            
            var ordername  = currentOrder.data.currentDiner;
            var newOrder =  currentOrder.data.order[ordername] + ' ' + quantity + ' ' + item;
            currentOrder.data.order[ordername] = newOrder;

            speechOutput  = 'Anything Else?';
            
            currentOrder.save(function () {
                response.tell(speechOutput);
            });
    });

    };

    intentHandlers.ResetOrderIntent = function (intent, session, response) {
     
        storage.loadOrder(session, function (currentOrder) {
            
            var ordername  = currentOrder.data.currentDiner;
            currentOrder.data.order[ordername] = '';

            speechOutput  = 'Order cleared for ' + ordername + '. Please order again' ;
            
            currentOrder.save(function () {
                response.tell(speechOutput);
            });
        });
    };

    intentHandlers.ResetWholeIntent = function (intent, session, response) {
        //remove all players
        storage.newOrder(session).save(function () {
            response.ask('Every order cleared.');
        });
};

    intentHandlers.NoIntent = function (intent, session, response) {
     
        storage.loadOrder(session, function (currentOrder) {
            

            var ordername  = currentOrder.data.currentDiner;
            currentOrder.data.placed[ordername] = 'Yes';

            var speechOutput  = 'Order finished for ' + ordername + '. Should I place the order?' ;
            
            currentOrder.save(function () {
                response.tell(speechOutput);
            });
        });
    };

    intentHandlers.YesIntent = function (intent, session, response) {
     
        storage.loadOrder(session, function (currentOrder) {
            
            var ordername  = currentOrder.data.currentDiner;
            
            var orderindex = currentOrder.data.ordername.indexOf(ordername);
            currentOrder.data.ordername.splice(orderindex, 1);

            delete currentOrder.data.order[ordername];
            delete currentOrder.data.placed[ordername];

            var speechOutput  = 'Order finished for ' + ordername + '. Wait for getting the order.' ;
            
            currentOrder.save(function () {
                response.tell(speechOutput);
            });
        });
    };

};
exports.register = registerIntentHandlers;
