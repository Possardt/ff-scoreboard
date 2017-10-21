(function(){
  'use strict';

  const express     = require('express');
  const app         = express();
  const espn        = require('espn-ff-api');
  const server      = require('http').createServer(app);
  const bodyParser  = require('body-parser');

  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(__dirname + '/public'));

  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
  });

  app.post('/getFFData', (req,res) => {
    if(validRequestBody(req.body)){
          espn.getSpecificMatchup(req.body.cookies, req.body.leagueId, req.body.teamLocation, req.body.teamName)
              .then(response => {
                res.send(response);
              });
    }
    else {
      res.sendStatus(400);
    }
  });

  const validRequestBody = body => {
    return (body.leagueId && body.teamLocation && body.teamName
        && body.cookies.espnS2 && body.cookies.SWID);
  }

  server.listen(3000);
  console.log('started on port 3000');
  exports = module.exports = app;
})();
