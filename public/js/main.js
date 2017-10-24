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
          matchup : result.data
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
            placeholder='team location' required />
          <input type='text'
            value={this.state.teamName}
            onChange={(event) => this.setState({teamName : event.target.value})}
            placeholder='team name' required />
          <input type='text'
            value={this.state.leagueId}
            onChange={(event) => this.setState({leagueId : event.target.value})}
            placeholder='league id' required />
          <input type='text'
            value={this.state.espnS2}
            onChange={(event) => this.setState({espnS2 : event.target.value})}
            placeholder='espnS2 cookie' required />
          <input type='text'
            value={this.state.SWID}
            onChange={(event) => this.setState({SWID : event.target.value})}
            placeholder='SWID cookie' required />
          <button type='submit'>Add team</button>
        </form>
      </div>
    );
  }
}

const Scoreboard = (props) => {
  return(
    <div>
      <div>
        <span>
          {props.matchup[0].teamName} : {props.matchup[0].score}
        </span>
      </div>
      <div>
        <span>
          {props.matchup[1].teamName} : {props.matchup[1].score}
        </span>
      </div>
    </div>
  );
}

const ScoreboardList = (props) => {
  return(
    <div>
      {props.matchups.map(matchup => <Scoreboard {...matchup}/>)}
    </div>
  );
};

class App extends React.Component {
  state = {
    matchups : []
  }
  addNewMatchup = (matchupInfo) => {
    console.log(matchupInfo);
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
