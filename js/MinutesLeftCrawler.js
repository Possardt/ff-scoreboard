(function(){
  'use strict';

  const htmlToJson    = require('html-to-json');
  const tough         = require('tough-cookie');
  const rp            = require('request-promise');
  const cookieJar     = rp.jar();

  let getMinutesLeft = (cookies, leagueId, teamId) => {
    let options = setupOptions(cookies, leagueId, teamId);
    return rp(options)
      .then(html => {
        return parseHTML(html);
      })
      .then(parsed => {
        let teamIdToMinutes = {};
        teamIdToMinutes[parsed.teamNameTeam1] = Number(parsed.minutesLeftTeam1);
        teamIdToMinutes[parsed.teamNameTeam2] = Number(parsed.minutesLeftTeam2);
        return teamIdToMinutes;
      })
      .catch(err => console.error(err));
  };

  let parseHTML = (html) => {
    return htmlToJson.parse(html, {
      'minutesLeftTeam1' : ($doc) => {
        return $doc.find('.noHighlight')[2].children[0].next.children[0].data;
      },
      'minutesLeftTeam2' : ($doc) => {
        return $doc.find('.noHighlight')[6].children[0].next.children[0].data;
      },
      'teamNameTeam1' : ($doc) => {
        return $doc.find('b')[3].children[0].data;
      },
      'teamNameTeam2' : ($doc) => {
        return $doc.find('b')[7].children[0].data;
      }
    })
  };

  let setupOptions = (cookies, leagueId, teamId) => {
    return {
      method : 'GET',
      jar    : setUpCookies(cookies, cookieJar),
      uri    : 'http://games.espn.com/ffl/boxscorequick?leagueId=' + leagueId + '&teamId=' + teamId + '&scoringPeriodId=11&seasonId=2017&view=scoringperiod&version=quick'
    }
  };

  let setUpCookies = (cookies, cookieJar) => {
    const espnS2 = new tough.Cookie({
      key     : 'espn_s2',
      value   : cookies.espnS2,
      domain  : 'espn.com'
    });
    const SWID = new tough.Cookie({
      key     : 'SWID',
      value   : cookies.SWID,
      domain  : 'espn.com'
    });

    cookieJar.setCookie(espnS2, 'http://games.espn.com/');
    cookieJar.setCookie(SWID, 'http://games.espn.com/');

    return cookieJar;
  }

  module.exports = {
    getMinutesLeft : getMinutesLeft
  }
})();
