(function(){
  'use strict';

  const express     = require('express');
  const app         = express();
  const espn        = require('espn-ff-api');
  const server      = require('http').createServer(app);
  const bodyParser  = require('body-parser');
  const crawler     = require('./js/MinutesLeftCrawler.js');

  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(__dirname + '/public'));

  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
  });

  app.post('/getFFData', (req,res) => {
    if(validRequestBody(req.body)){
      let fullResponse;
      espn.getSpecificMatchup(req.body.cookies, req.body.leagueId, req.body.teamLocation, req.body.teamName)
          .then(response => {
            fullResponse = response;
            let teamId = findTeamId(response, req.body.teamLocation, req.body.teamName);
            return crawler.getMinutesLeft(req.body.cookies, req.body.leagueId, teamId);
          })
          .then(crawledInfo => {
            if(crawledInfo[req.body.teamName]){
              return fullResponse
                .forEach(team => team.minutesLeft = crawledInfo[team.teamName]);
            }
            else {
              return fullResponse
                .forEach(team => team.minutesLeft = 540);
            }
          })
          .then(() => {
            res.send(fullResponse);
          })
          .catch(err => {
            console.error(err);
            res.status(500).send(err);
          });
    }
    else {
      res.sendStatus(400);
    }
  });

  let validRequestBody = (body) => {
    return (body.leagueId && body.teamLocation &&
            body.teamName && body.cookies.espnS2 &&
            body.cookies.SWID);
  }

  let findTeamId = (teams, teamLocation, teamName) => {
    return teams
      .filter(team => team.teamName === (teamLocation + ' ' + teamName))
      .map(team => team.teamId)[0];
  };

  server.listen(3000);
  console.log('started on port 3000');
  exports = module.exports = app;
})();
