var uws = require('uws');
var uwsClient = new uws("ws://195.148.149.148:3001", {perMessageDeflate: false});


uwsClient.on('open', function open() {
    uwsClient.send('rbpi Initialization');
});

uwsClient.on('message', function incoming(data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
    console.log("Data /", data);
    console.log("Flags /", flags);
});