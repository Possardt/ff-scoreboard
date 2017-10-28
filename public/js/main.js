class Form extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        teamLocation : '',
        teamName     : '',
        leagueId     : '',
        espnS2       : '',
        SWID         : ''
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    return axios
      .post('/getFFData', {
        teamLocation : this.state.teamLocation,
        teamName     : this.state.teamName,
        leagueId     : this.state.leagueId,
        cookies      : {
          espnS2     : this.state.espnS2,
          SWID       : this.state.SWID
        }
      })
      .then(result => {
        const matchupInfo = {
          request : {
            teamLocation : this.state.teamLocation,
            teamName     : this.state.teamName,
            leagueId     : this.state.leagueId,
            cookies      : {
              espnS2     : this.state.espnS2,
              SWID       : this.state.SWID
            }
          },
          matchup  : result.data,
          homeTeam : this.state.teamLocation + ' ' + this.state.teamName
        };
        this.state.teamLocation = '';
        this.state.teamName = '';
        this.state.leagueId = '';
        this.state.espnS2 = '';
        this.state.SWID = '';
        this.props.onSubmit(matchupInfo);
      })
      .catch(error => alert(error));
  };

  render() {
    return (
      <div className='enter-team'>
        <form onSubmit={this.handleSubmit}>
          <input type='text'
            value={this.state.teamLocation}
            onChange={(event) => this.setState({teamLocation : event.target.value})}
            placeholder='Team Location' required />
          <input type='text'
            value={this.state.teamName}
            onChange={(event) => this.setState({teamName : event.target.value})}
            placeholder='Team Name' required />
          <input type='text'
            value={this.state.leagueId}
            onChange={(event) => this.setState({leagueId : event.target.value})}
            placeholder='League ID' required />
          <input type='text'
            value={this.state.espnS2}
            onChange={(event) => this.setState({espnS2 : event.target.value})}
            placeholder='ESPNS2 Cookie' required />
          <input type='text'
            value={this.state.SWID}
            onChange={(event) => this.setState({SWID : event.target.value})}
            placeholder='SWID Cookie' required />
          <button type='submit'>Add team</button>
        </form>
      </div>
    );
  }
}

const HalfOfScoreBoard = (props) => {
  let backgroundStyle = {
    background: 'url(' + props.team.logoUrl + ')',
    position: 'absolute',
    zIndex: '-1',
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px',
    opacity: '0.2',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPositionX: 'center'
  };
  let scoreChange = props.team.score - props.prevScore;
  let isHome = props.team.teamName === props.homeTeam;
  let redFlash = (!isHome && scoreChange);
  let greenFlash = (isHome && scoreChange);
  let flashClassName = redFlash ? 'scorecard scoreFlashRed' : greenFlash ? 'scorecard scoreFlashGreen' : 'scorecard';
  return(
    <div className={flashClassName}>
      <div className='teamName'>
        <div style={backgroundStyle}></div>
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
        prevMatchup : {}
    }
  }

  getMatchupData = () => {
    console.log('calling' + this.props.homeTeam);
    return axios.post('/getFFData', this.state.request)
      .then((result) => {
        this.setState((prevState) => ({
          prevMatchup : prevState.matchup || result.data,
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
    let prevGameScore = this.state.prevMatchup.matchup ?  this.state.prevMatchup.matchup[index].score : 0;
    return(
      <div className='scoreboard'>
        {this.state.matchup.map((mu, index) =>
          <HalfOfScoreBoard team={mu} key={index} prevScore={prevGameScore} homeTeam={this.props.homeTeam}/>
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
