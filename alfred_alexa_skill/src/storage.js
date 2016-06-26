/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var AWS = require("aws-sdk");

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    /*
     * The Game class stores all game states for the user
     */
    function Order(session, data) {
        if (data) {
            this.data = data;
        } else {
            this.data = {
                currentDiner: '',
                ordername: [],
                order: {},
                placed:{}
            };
        }
        this._session = session;
    }

    Order.prototype = {
        save: function (callback) {
            //save the game states in the session,
            //so next time we can save a read from dynamoDB
            this._session.attributes.currentOrder = this.data;
            dynamodb.putItem({
                TableName: 'Orders',
                Item: {
                    OrderId: {
                        S: this._session.user.userId
                    },
                    Data: {
                        S: JSON.stringify(this.data)
                    }
                }
            }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                if (callback) {
                    callback();
                }
            });
        }
    };

    return {
        loadOrder: function (session, callback) {
            if (session.attributes.currentOrder) {
                console.log('get game from session=' + session.attributes.currentOrder);
                callback(new Order(session, session.attributes.currentOrder));
                return;
            }
            dynamodb.getItem({
                TableName: 'Orders',
                Key: {
                    OrderId: {
                        S: session.user.userId
                    }
                }
            }, function (err, data) {
                var currentOrder;
                if (err) {
                    console.log(err, err.stack);
                    currentOrder = new Order(session);
                    session.attributes.currentOrder = currentOrder.data;
                    callback(currentOrder);
                } else if (data.Item === undefined) {
                    currentOrder = new Order(session);
                    session.attributes.currentOrder = currentOrder.data;
                    callback(currentOrder);
                } else {
                    console.log('get game from dynamodb=' + data.Item.Data.S);
                    currentOrder = new Order(session, JSON.parse(data.Item.Data.S));
                    session.attributes.currentOrder = currentOrder.data;
                    callback(currentOrder);
                }
            });
        },
        newOrder: function (session) {
            return new Order(session);
        }
    };
})();
module.exports = storage;
