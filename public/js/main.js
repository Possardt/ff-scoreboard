
const transformSubmit = (matchupStr) => {
  let details = matchupStr.split(',');
  const request = {cookies : {}};
  details.forEach(detail => {
    let detailArr = detail.split('=');
    if(detailArr[0] === 'SWID' || detailArr[0] === 'espnS2'){
      request.cookies[detailArr[0]] = detailArr[1];
    }
    else{
      request[detailArr[0]] = detailArr[1];
    }
  });
  return request;
}

class Form extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        matchupString : ''
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let requestDetails = transformSubmit(this.state.matchupString);
    return axios.post('/getFFData', requestDetails)
      .then(result => {
        const matchupInfo = {
          request  : requestDetails,
          matchup  : result.data,
          homeTeam : requestDetails.teamLocation + ' ' + requestDetails.teamName
        }
        this.state.matchupString = '';
        this.props.onSubmit(matchupInfo);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className='enter-team'>
        <form onSubmit={this.handleSubmit}>
          <input type='text'
            value={this.state.matchupString}
            onChange={(event) => this.setState({matchupString : event.target.value})}
            placeholder='Matchup String' required />
          <button type='submit'>Add team</button>
        </form>
      </div>
    );
  }
}

const HalfOfScoreBoard = (props) => {
  let logo = props.team.logoUrl ? props.team.logoUrl : 'http://g.espncdn.com/lm-static/ffl17/images/default.svg';
  let backgroundLogo = {
    background: 'url(' + logo + ')',
    position: 'absolute',
    zIndex: '-1',
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px',
    opacity: '0.2',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPositionX: 'center',
    marginTop: '1.5em',
    marginBottom: '0.25em'
  };
  let scoreChange = props.team.score - props.prevScore;
  let isHome = props.team.teamName === props.homeTeam;
  let redFlash = (!isHome && scoreChange);
  let greenFlash = (isHome && scoreChange);
  let flashClassName = redFlash ? 'scorecard scoreFlashRed' : greenFlash ? 'scorecard scoreFlashGreen' : 'scorecard';

  let percentDone = Math.floor(((540 - props.team.minutesLeft) / 540) * 100);
  let teamNameBackground = {
    background : 'linear-gradient(90deg, ' + (isHome ? ' rgba(127, 191, 63, 0.5) ' : ' rgba(191, 63, 63, 0.5) ')
                  + percentDone + '%, rgba(1,1,1,0) 0%)'
  }
  return(
    <div className={flashClassName}>
      <div className='teamName' style={teamNameBackground}>
        <div style={backgroundLogo}></div>
        <div>
          {props.team.teamName}
        </div>
      </div>
      <div className='score'>
        {props.team.score}
      </div>
    </div>
  );
}

class Scoreboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        matchup     : props.matchup,
        request     : props.request,
        prevMatchup : null
    }
  }

  getMatchupData = () => {
    console.log('calling: ' + this.props.homeTeam);
    return axios.post('/getFFData', this.state.request)
      .then((result) => {
        this.setState((prevState) => ({
          prevMatchup : prevState.matchup || result.data.matchup,
          matchup     : result.data
        }));
      });
  }

  componentDidMount = () => {
    setInterval(() => {
      this.getMatchupData();
    }, 10000);
  }

  render(){
    let prevGameArr = this.state.prevMatchup ? this.state.prevMatchup.map((mu) => {return mu.score;}) : [0, 0];
    return(
      <div className='scoreboard'>
        {this.state.matchup.map((mu, index) =>
          <HalfOfScoreBoard team={mu} key={index} prevScore={prevGameArr[index]} homeTeam={this.props.homeTeam}/>
        )}
      </div>
    );
  }
}

const ScoreboardList = (props) => {
  return(
    <div className='scoreboard-list'>
      {props.matchups.map((matchup, index) => <Scoreboard key={index} {...matchup}/>)}
    </div>
  );
};

class App extends React.Component {
  state = {
    matchups : []
  }
  addNewMatchup = (matchupInfo) => {
    this.setState((prevState) => ({
      matchups : prevState.matchups.concat([matchupInfo])
    }));
  }

  render() {
    return (
      <div>
        <ScoreboardList matchups={this.state.matchups} />
        <Form onSubmit={this.addNewMatchup}  />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('mountNode'));
