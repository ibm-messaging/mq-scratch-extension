# ScratchX extension for IBM MQ

This is the code for the [ScratchX extension](https://scratchx.org/) for IBM MQ. In order to run the extension, you will need a running instance of IBM MQ (in Docker or on a machine) with the REST API enabled.

## Setting up IBM MQ and the REST API

Create a directory for the extension on your machine.

Download the Dockerfile and the scratchmqwebuser.xml file into this folder.

*NOTE: the Docker container will be open to requests from the scratchx.org domain. We do this to allow messages from the ScratchX site to be processed by IBM MQ in the container.*

Navigate to this folder and build the Docker image with the .xml file:

```bash
docker build -t "mq-scratch" .
```

Create a Docker network called mq-demo-network to allow a volume and container to communicate with each other.

```bash
docker network create mq-demo-network
```

Run a container (and create a docker volume) with

```bash
docker run --env LICENSE=accept --env MQ_QMGR_NAME=QM1 --volume qmdatascratch:/mnt/mqm --publish 1414:1414 --publish 9443:9443 --network mq-demo-network --network-alias qmgr --detach --env MQ_APP_PASSWORD=!!!Put_your_password_here!!! mq-scratch:latest
```

This will set the password for connecting applications to be '!!!Put_your_password_here!!!', unless you change it in the above command. We would recommend doing this.

[Have a look here](https://developer.ibm.com/messaging/learn-mq/) if you'd like to learn more about IBM MQ.

## Running the extension

In order to run the extension, you will need to have IBM MQ running on your machine or running in a Docker container.

1. Download the mq_scratch_extension.sbx.js file and the mq_lights.sb2 file.
2. Navigate to <https://scratchx.org/>.
3. Click 'open extension URL' but click 'open' without specifying a URL.
4. To open a sample project, click 'File -> Load Project' and select the mq_lights.sb2 file
5. SHIFT + CLICK on the 'Load Experimental Extension' tab, then select the mq_scratch_extension.sbx.js file.
6. MQ blocks will appear under the 'More Blocks' blocks menu.
7. Set the credentials (IP address, MQ username and password) in each block when you use it.
8. Enjoy playing with IBM MQ!

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