# ScratchX extension for IBM MQ

This is the code for the [ScratchX extension](https://scratchx.org/) for IBM MQ. In order to run the extension, you will need a running instance of IBM MQ (in Docker or on a machine) with the REST API enabled.

## Setting up IBM MQ and the REST API

Follow [these instructions](https://developer.ibm.com/messaging/learn-mq/mq-tutorials/mq-connect-to-queue-manager/) to get started with IBM MQ.

In order to start sending messages through the IBM MQ REST API, you first need to edit one MQ file to allow this to happen. Edit the file

```bash
vi /var/mqm/web/installations/Installation1/servers/mqweb/mqwebuser.xml
```

(NOTE: If you're using the MQ image in Docker, exec into the container with

```bash
docker exec -ti **your_container_id** /bin/bash
```

before running the above command.)

Add this info to the end of the file, before the `</server>` tag:

```bash
<cors domain="/ibmmq/rest/v1"
       allowedOrigins="https://scratchx.org/*"
       allowedMethods="GET, POST, PUT, DELETE"
       allowedHeaders="*"
       exposeHeaders="Authorization, Content-Type, ibm-mq-rest-csrf-token"
       allowCredentials="true"
       maxAge="3600" />
```

MQ's REST API is now enabled.

(NOTE: if using Docker, when the container is stopped it may be necessary to repeat these steps to re-enable the REST API. Watch this space!)

## Running the extension

In order to run the extension, you will need to have IBM MQ running on your machine or running in a Docker container.

1. Copy the url of this repo.
2. Navigate to <https://scratchx.org/>.
3. Click 'open extension URL' and paste the address of the repo. This will pull in the MQ blocks.
4. Set the credentials (IP address, MQ username and password) in each block when you use it
5. Enjoy playing with IBM MQ!

## Blocks

The extension contains put, get, request and response blocks.

Correlation IDs can be specified for the request response blocks by clicking on the dropdown menu on each block and selecting the request number. Ensure this is the same for each "Make Request" and corresponding "Get Response" block.

## License

(c) Copyright IBM Corporation 2018

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License [here](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.