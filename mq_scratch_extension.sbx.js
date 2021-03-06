// ScratchX extension to use the IBM MQ REST client with Scratch. Defines blocks to be used in Scratch

/*(c) Copyright IBM Corporation 2018

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License [here](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

(function (ext) {
  var ext = this;
  var apiBase = "/ibmmq/rest/v1/"
  var ajaxRequestObject = null

  ext._shutdown = function () {};
  ext._getStatus = function () {
    return {
      status: 2,
      msg: 'Ready'
    };
  };

  ext._stop = function () {
    console.log("stop sign has been clicked!")
    console.log(ajaxRequestObject)
    ajaxRequestObject.abort()
  };

  function successPathAjaxCall(mode, callback) {
    return function (data) {
      if (mode === 'POST') {
        console.log('REST call successfully made')
        console.log("Message sent")
        console.log(params.message)
        if (callback) {
          callback('Message successfully processed by IBM MQ') // Appears in a bubble when block is clicked
        }
      } else { // mode === 'DELETE'
        console.log('REST call worked')
        if (data !== undefined) {
          console.log("Message Received: ")
          console.log(data)
        }
        if (callback) {
          callback(data) // Appears in a bubble when block is clicked
        }
      }
    };
  }

  function errorPathAjaxCall(callback) {
    return function (err, status) {
      console.log('REST call failed')
      if (params.callback) {
        callback('Message operation failed')
      }
    };
  }

  function ajaxCall(params) {
    headers = {
      'Authorization': 'Basic ' + params.base64UserPwd,
      'Content-Type': 'text/plain',
      'ibm-mq-rest-csrf-token': '',
    }
    if (params.additionalHeaders) {
      for (element in params.additionalHeaders) {
        headers[element] = params.additionalHeaders[element]
      }
    }
    ajaxRequestObject = $.ajax({
      url: params.url,
      type: params.type,
      dataType: 'text',
      data: params.message,
      headers: headers,
      success: successPathAjaxCall(params.type, params.callback),
      error: errorPathAjaxCall(params.callback),
    });
  }

  function makeFullCorrelationId(cID) {
    var newCorrelationId = ''
    for (i = 0; i < 48; i++) {
      newCorrelationId += cID
    }
    return newCorrelationId
  }

  function setCorrelationId(messageId) {
    var characterForCorrelationId = messageId[messageId.length - 1]
    correlationId = makeFullCorrelationId(characterForCorrelationId)
    return correlationId
  }

  ext.put_message = function (hostname, qmName, queueName, user, password, message, callback) {
    var authString = user + ':' + password
    console.log('Sending message to IBM MQ');
    console.log("messaging/qmgr/" + qmName + "/queue/" + queueName + "/message")
    console.log(authString)
    params = {
      url: 'https://' + hostname + ':9443' + apiBase + 'messaging/qmgr/' + qmName + '/queue/' + queueName + '/message',
      type: 'POST',
      base64UserPwd: btoa(authString),
      additionalHeaders: {},
      message: message,
      callback: callback
    }
    ajaxCall(params)
  }

  ext.get_message = function (hostname, qmName, queueName, user, password, callback) {
    var authString = user + ':' + password
    console.log('Getting message from IBM MQ');
    console.log("messaging/qmgr/" + qmName + "/queue/" + queueName + "/message")
    console.log(authString)
    params = {
      url: 'https://' + hostname + ':9443' + apiBase + 'messaging/qmgr/' + qmName + '/queue/' + queueName + '/message?wait=120000',
      type: 'DELETE',
      base64UserPwd: btoa(authString),
      additionalHeaders: {},
      callback: callback
    }
    ajaxCall(params)
  }

  ext.make_request = function (hostname, qmName, queueName, replyQueue, requestId, user, password, message, callback) {
    var authString = user + ':' + password
    console.log('Sending message to IBM MQ');
    console.log("messaging/qmgr/" + qmName + "/queue/" + queueName + "/message")
    console.log(authString)
    correlationId = setCorrelationId(requestId)
    console.log('correlation id of request is: ' + correlationId)
    params = {
      url: 'https://' + hostname + ':9443' + apiBase + 'messaging/qmgr/' + qmName + '/queue/' + queueName + '/message',
      type: 'POST',
      base64UserPwd: btoa(authString),
      additionalHeaders: {
        'ibm-mq-md-replyTo': replyQueue,
        'ibm-mq-md-correlationId': correlationId
      },
      message: message,
      callback: callback
    }
    ajaxCall(params)
  }

  ext.get_response = function (hostname, qmName, queueName, responseId, user, password, callback) {
    var authString = user + ':' + password
    console.log('Getting message from IBM MQ');
    console.log("messaging/qmgr/" + qmName + "/queue/" + queueName + "/message")
    console.log(authString)
    correlationId = setCorrelationId(responseId)
    console.log('correlation id of response is: ' + correlationId)
    params = {
      url: 'https://' + hostname + ':9443' + apiBase + 'messaging/qmgr/' + qmName + '/queue/' + queueName + '/message?wait=120000' + '&correlationId=' + correlationId,
      type: 'DELETE',
      base64UserPwd: btoa(authString),
      additionalHeaders: {},
      callback: callback
    }
    ajaxCall(params)
  }

  // Block and block menu descriptions
  var descriptor = {
    blocks: [
      ['R', 'Get Msg %s %s %s %s %s', 'get_message', 'localhost', 'QM1', 'DEV.QUEUE.1', 'app', 'passw0rd'],
      ['w', 'Put Msg %s %s %s %s %s %s', 'put_message', 'localhost', 'QM1', 'DEV.QUEUE.1', 'app', 'passw0rd', 'message'],
      ['w', 'Get Msg %s %s %s %s %s', 'get_message', 'localhost', 'QM1', 'DEV.QUEUE.1', 'app', 'passw0rd'],
      ['w', 'Make Request %s %s %s %s %m.requestCorrIdMenu %s %s %s', 'make_request', 'localhost', 'QM1', 'DEV.QUEUE.1', 'DEV.QUEUE.2', 'Request 1', 'app', 'passw0rd', 'message'],
      ['R', 'Get Response %s %s %s %m.requestCorrIdMenu %s %s', 'get_response', 'localhost', 'QM1', 'DEV.QUEUE.1', 'Request 1', 'app', 'passw0rd'],
      ['w', 'Get Response %s %s %s %m.requestCorrIdMenu %s %s', 'get_response', 'localhost', 'QM1', 'DEV.QUEUE.1', 'Request 1', 'app', 'passw0rd'],
    ],
    menus: {
      requestCorrIdMenu: ['Request 1', 'Request 2', 'Request 3', 'Request 4', 'Request 5', 'Request 6', 'Request 7', 'Request 8', 'Request 9', 'Request 10'],
    },
  };

  // Register the extension
  ScratchExtensions.register('IBM MQ REST Client', descriptor, ext);
})({});