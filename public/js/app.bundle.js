/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const transformSubmit = matchupStr => {
  let details = matchupStr.split(',');
  const request = { cookies: {} };
  details.forEach(detail => {
    let detailArr = detail.split('=');
    if (detailArr[0] === 'SWID' || detailArr[0] === 'espnS2') {
      request.cookies[detailArr[0]] = detailArr[1];
    } else {
      request[detailArr[0]] = detailArr[1];
    }
  });
  return request;
};

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = event => {
      event.preventDefault();
      let requestDetails = transformSubmit(this.state.matchupString);
      return axios.post('/getFFData', requestDetails).then(result => {
        const matchupInfo = {
          request: requestDetails,
          matchup: result.data,
          homeTeam: requestDetails.teamLocation + ' ' + requestDetails.teamName
        };
        this.state.matchupString = '';
        this.props.onSubmit(matchupInfo);
      }).catch(err => {
        console.log(err);
      });
    };

    this.state = {
      matchupString: ''
    };
  }

  render() {
    return React.createElement(
      'div',
      { className: 'enter-team' },
      React.createElement(
        'form',
        { onSubmit: this.handleSubmit },
        React.createElement('input', { type: 'text',
          value: this.state.matchupString,
          onChange: event => this.setState({ matchupString: event.target.value }),
          placeholder: 'Matchup String', required: true }),
        React.createElement(
          'button',
          { type: 'submit' },
          'Add team'
        )
      )
    );
  }
}

const HalfOfScoreBoard = props => {
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
  let redFlash = !isHome && scoreChange;
  let greenFlash = isHome && scoreChange;
  let flashClassName = redFlash ? 'scorecard scoreFlashRed' : greenFlash ? 'scorecard scoreFlashGreen' : 'scorecard';

  let percentDone = Math.floor((540 - props.team.minutesLeft) / 540 * 100);
  let teamNameBackground = {
    background: 'linear-gradient(90deg, ' + (isHome ? ' rgba(127, 191, 63, 0.5) ' : ' rgba(191, 63, 63, 0.5) ') + percentDone + '%, rgba(1,1,1,0) 0%)'
  };
  return React.createElement(
    'div',
    { className: flashClassName },
    React.createElement(
      'div',
      { className: 'teamName', style: teamNameBackground },
      React.createElement('div', { style: backgroundLogo }),
      React.createElement(
        'div',
        null,
        props.team.teamName
      )
    ),
    React.createElement(
      'div',
      { className: 'score' },
      props.team.score
    )
  );
};

class Scoreboard extends React.Component {
  constructor(props) {
    super(props);

    this.getMatchupData = () => {
      console.log('calling: ' + this.props.homeTeam);
      return axios.post('/getFFData', this.state.request).then(result => {
        this.setState(prevState => ({
          prevMatchup: prevState.matchup || result.data.matchup,
          matchup: result.data
        }));
      });
    };

    this.componentDidMount = () => {
      setInterval(() => {
        this.getMatchupData();
      }, 10000);
    };

    this.state = {
      matchup: props.matchup,
      request: props.request,
      prevMatchup: null
    };
  }

  render() {
    let prevGameArr = this.state.prevMatchup ? this.state.prevMatchup.map(mu => {
      return mu.score;
    }) : [0, 0];
    return React.createElement(
      'div',
      { className: 'scoreboard' },
      this.state.matchup.map((mu, index) => React.createElement(HalfOfScoreBoard, { team: mu, key: index, prevScore: prevGameArr[index], homeTeam: this.props.homeTeam }))
    );
  }
}

const ScoreboardList = props => {
  return React.createElement(
    'div',
    { className: 'scoreboard-list' },
    props.matchups.map((matchup, index) => React.createElement(Scoreboard, _extends({ key: index }, matchup)))
  );
};

class App extends React.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      matchups: []
    }, this.addNewMatchup = matchupInfo => {
      this.setState(prevState => ({
        matchups: prevState.matchups.concat([matchupInfo])
      }));
    }, _temp;
  }

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(ScoreboardList, { matchups: this.state.matchups }),
      React.createElement(Form, { onSubmit: this.addNewMatchup })
    );
  }
}

ReactDOM.render(React.createElement(App, null), document.getElementById('mountNode'));

/***/ })
/******/ ]);
//# sourceMappingURL=app.bundle.js.map