var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
 
var app = express();
var port = process.env.PORT || 3000;
 
// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
 
// test route
app.post('/e40', function (req, res) {
  console.dir(req);
  var data = req.data;

  // if the token doesn't match, the request is not coming from Slack. 401 = unauthorized
  if (process.env.OUTGOING_WEBHOOK_TOKEN && data.token !== process.env.OUTGOING_WEBHOOK_TOKEN) {
    return res.status(401).end();
  }
  // if slackbot is chatting, return. if we allow him through, we can get an infinite loop.
  // slack can ban this app for spamming the chatroom.
  if (data.user_name === 'slackbot') {
    return res.status(200).end();
  }
  // CHOICES
  var choices = [
    {
      call: "told on a",
      response: "NOPE"
    },
    {
      call: "squeezed a trigger",
      response: "YUP"
    }
  ];
  var appropriate = _.find(choices, function(choice) {
    return data.text.match(choice.call);
  });


  var botResponse = {
    // icon_url: 'http://i.imgur.com/GSEfJzI.jpg',
    username: 'E-40',
    text: appropriate.response
  };

  // reply to the channel.
  console.log(appropriate.response + " - everybody's got choices");
  res.json(botResponse);
});


// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});
 
app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});