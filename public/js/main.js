//create class for adding to list of matchiups
//create display for list of matchups.
//use axios for posts

axios
  .post('/getFFData', {
    leagueId     : '1371354',
    teamLocation : 'Clinton-Dix',
    teamName     : 'Picks'
  })
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  });
