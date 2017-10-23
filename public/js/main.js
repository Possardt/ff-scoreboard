//create class for adding to list of matchiups
//create display for list of matchups.
//use axios for posts

axios
  .post('/getFFData', {
    leagueId     : '1371354',
    teamLocation : 'Clinton-Dix',
    teamName     : 'Picks',
    cookies      : {
      espnS2 : 'AEBw1RduzxFd0OKGfYQseFZnJShYpAYOCuPKDJy89cYAUg0DKlTaMre%2BQ%2F6%2B3Da49vP13D%2Bj26w%2BOHwDCjJtPt%2FOQNFPxAHLICGp%2FEWmoMpZqDogXaQgnAf%2B3Txvzxx3X0L8Wu%2B11h7hr4pzWDVW9FznzZDfU%2Bcm%2F97zrVJ%2B1StZr3bBQRDmwmxLZwF9XNifBmZOd%2FF7QOEh5hR3HQpxIbqmG6PTiR08iUiSgjT42eS8eICWmg7n6rUAm5oNlGqBRD%2B8EMGaCgvHDY29%2BpZ5cLTk',
      SWID    : '{40A724C8-692C-4C0D-9E90-330BBD6E6784}'
    }
  })
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  });
