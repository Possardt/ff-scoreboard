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

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = event => {
      event.preventDefault();
      return axios.post('/getFFData', {
        teamLocation: this.state.teamLocation,
        teamName: this.state.teamName,
        leagueId: this.state.leagueId,
        cookies: {
          espnS2: this.state.espnS2,
          SWID: this.state.SWID
        }
      }).then(result => {
        const matchupInfo = {
          request: {
            teamLocation: this.state.teamLocation,
            teamName: this.state.teamName,
            leagueId: this.state.leagueId,
            cookies: {
              espnS2: this.state.espnS2,
              SWID: this.state.SWID
            }
          },
          matchup: result.data
        };
        this.state.teamLocation = '';
        this.state.teamName = '';
        this.state.leagueId = '';
        this.state.espnS2 = '';
        this.state.SWID = '';
        this.props.onSubmit(matchupInfo);
      }).catch(error => alert(error));
    };

    this.state = {
      teamLocation: '',
      teamName: '',
      leagueId: '',
      espnS2: '',
      SWID: ''
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
          value: this.state.teamLocation,
          onChange: event => this.setState({ teamLocation: event.target.value }),
          placeholder: 'team location', required: true }),
        React.createElement('input', { type: 'text',
          value: this.state.teamName,
          onChange: event => this.setState({ teamName: event.target.value }),
          placeholder: 'team name', required: true }),
        React.createElement('input', { type: 'text',
          value: this.state.leagueId,
          onChange: event => this.setState({ leagueId: event.target.value }),
          placeholder: 'league id', required: true }),
        React.createElement('input', { type: 'text',
          value: this.state.espnS2,
          onChange: event => this.setState({ espnS2: event.target.value }),
          placeholder: 'espnS2 cookie', required: true }),
        React.createElement('input', { type: 'text',
          value: this.state.SWID,
          onChange: event => this.setState({ SWID: event.target.value }),
          placeholder: 'SWID cookie', required: true }),
        React.createElement(
          'button',
          { type: 'submit' },
          'Add team'
        )
      )
    );
  }
}

const Scoreboard = props => {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        null,
        props.matchup[0].teamName,
        ' : ',
        props.matchup[0].score
      )
    ),
    React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        null,
        props.matchup[1].teamName,
        ' : ',
        props.matchup[1].score
      )
    )
  );
};

const ScoreboardList = props => {
  return React.createElement(
    'div',
    null,
    props.matchups.map(matchup => React.createElement(Scoreboard, matchup))
  );
};

class App extends React.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      matchups: []
    }, this.addNewMatchup = matchupInfo => {
      console.log(matchupInfo);
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