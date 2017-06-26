# Raspberry pi video transmitter
## 1. Installation
`$ git clone git@gitlab.mw.metropolia.fi:sohjoa/rbpi.git`  
`$ npm install`
## 2. Description
 Nodejs application which uses uws to establish websocket connection to streamer controller. HTTP api implemented at 
 streamer controller calls methods of the video transmitter and passes client initialized variabled. Video transmitter 
 validates the variables. Each protocol has its' own validation process, defined in respective components.
  
## 3. Improvements
 - There is no authentication nor authorization when accessing the http api.
 - The control is limited to starting/stopping the video streams.
   
## 4. Requirements for new protocol:
 Implementing new streaming method or service should be quite straightforward.
  1. Define what is the bash command to start stream for said method/service, which should pipe raspivid feed to another 
  application/method.
  2. Create component with start, stop and status methods. Start method will parse the user input and execute the bash 
  command from step 1.
