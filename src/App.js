import React, { PureComponent } from 'react';
import axios from 'axios';
import Chart from 'chart.js';
import classes from './App.css';
import WeightItem from './components/WeightItem.js';
import './App.css';
import Login from './components/Login.js';
import Loading from './components/Loading.js';

let myLineChart;
var Lweight = [];
var Ldate = [];
var allInputs = [];
var allGoalInputs = [];
var allDateInputs = [];
var counter = 0;
var currentWeight = '';

export default class LineGraph extends PureComponent {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    global.email = '';
    global.error = 0;
    global.firstName = '';
    this.state = {
      //login page states
      createBtn: 'btnlogin',
      loginBtn: 'noDisplay',
      signUpTop: 'buttonTopActive',
      loginTop: 'buttonTop',
      firstName: '',
      loggedIn: false,
      emailInput: '',
      passwordInput: '',
      firstnameInput: '',
      error: 0,
      loadingImage: 'noDisplay',
      //weight tracker states
      formStatus: 'noDisplay',
      weightInput: '',
      DateInput: '',
      goalInput: 0,
      chartData: {},
      goalFormStatus: 'noDisplay',
      todos: allInputs,
      currentWeight: '',
      username: '',
      data: 0,
      token: '',
    };
  }
  //functions for weight tracker
  afterLogin = () => {
    axios
      .get('https://warm-inlet-95424.herokuapp.com/api/stuff', {
        params: {
          email: this.state.emailInput.toLowerCase(),
        },
        headers: { Authorization: `Bearer ${this.state.token}` },
      })
      .then((response) => {
        if (response.data.length > 0) {
          response.data.sort(function (a, b) {
            var dateA = new Date(a.date),
              dateB = new Date(b.date);
            return dateA - dateB; //sort by date ascending
          });
        }

        response.data.length > 0
          ? this.setState({
              username: response.data[0].username,
            })
          : this.setState({
              username: this.state.firstnameInput,
            });
        response.data.shift();
        this.setState({
          todos: response.data,
          data: 0,
          email: this.state.emailInput,
        });
        Lweight = [];
        Ldate = [];
        allGoalInputs = [];
        for (let i = 0; i < this.state.todos.length; i++) {
          Lweight[i] = this.state.todos[i].weight;
          Ldate[i] = this.state.todos[i].date;
          allGoalInputs[i] = this.state.todos[this.state.todos.length - 1].goal;
        }

        if (this.state.todos.length > 0) {
          this.setState({
            goalInput: this.state.todos[this.state.todos.length - 1].goal,
            currentWeight: this.state.todos[this.state.todos.length - 1].weight,
          });
        } else {
          this.setState({
            goalInput: 0,
            currentWeight: '',
          });
        }
        this.buildChart();
      });
  };

  componentDidUpdate = () => {
    if (this.state.data !== 0 || global.checker >= 1) {
      global.checker--;
      this.afterLogin();
    }
  };

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext('2d');

    if (typeof myLineChart !== 'undefined') myLineChart.destroy();

    myLineChart = new Chart(myChartRef, {
      type: 'line',
      data: {
        //Bring in data
        labels: Ldate,
        datasets: [
          {
            label: 'Weight',
            data: Lweight,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)',
            ],
          },
          {
            label: 'Goal',
            data: allGoalInputs,
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)',
            ],
          },
        ],
      },
      options: {
        //Customize chart options
        responsive: true,
        legend: {
          position: 'bottom',
        },
      },
    });
  };

  handleAddForm = (event) => {
    event.preventDefault();
    this.setState({
      formStatus: 'formStyle',
      weightInput: '',
      DateInput: '',
    });
  };

  handleOK = (event) => {
    event.preventDefault();
    if (this.state.weightInput !== '' && this.state.DateInput !== '') {
      allDateInputs[counter] = this.state.DateInput;
      allInputs[counter] = {
        id: '',
        goal: this.state.goalInput,
        weight: this.state.weightInput,
        date: this.state.DateInput,
        email: this.state.emailInput,
        username: this.state.username,
      };
      console.log(this.state.username);
      axios
        .post(
          'https://warm-inlet-95424.herokuapp.com/api/stuff',
          allInputs[counter],
          {
            headers: {
              Authorization: `Bearer ${this.state.token}`,
            },
          }
        )

        .then((res) => {
          this.afterLogin();
          counter++;
          this.setState({ formStatus: 'noDisplay' });
          currentWeight = Lweight[Lweight.length - 1];
        });
    } else {
      alert('one or more fields required');
    }
  };

  handleCancel = (event) => {
    event.preventDefault();
    this.setState({ formStatus: 'noDisplay' });
  };

  handleWeight = (event) => {
    this.setState({ weightInput: event.target.value });
  };

  handleDate = (event) => {
    this.setState({ DateInput: event.target.value });
  };

  handleGoal = (event) => {
    event.preventDefault();
    this.setState({ goalInput: event.target.value });
  };

  handleGoalOk = (event) => {
    event.preventDefault();

    const upDatedList = {
      goal: this.state.goalInput,
    };

    if (this.state.todos.length > 0) {
      axios
        .put(
          'https://warm-inlet-95424.herokuapp.com/api/stuff/' +
            this.state.todos[this.state.todos.length - 1]._id,
          upDatedList,
          {
            headers: {
              Authorization: `Bearer ${this.state.token}`,
            },
          }
        )
        .then((res) => {
          this.afterLogin();
        });

      let i = 0;
      for (i = 0; i <= allInputs.length; i++) {
        allGoalInputs[i] = this.state.goalInput;
      }
    }
    this.setState({ goalFormStatus: 'noDisplay' });
  };

  handleGoalButton = (event) => {
    this.setState({ goalFormStatus: 'formStyle' });
  };

  callbackFunction = (childData) => {
    this.setState({ data: childData });
    console.log(this.state.data);
  };

  //functions for login page
  handleTopSignUpButton = (event) => {
    event.preventDefault();
    this.setState({
      signUpTop: 'buttonTopActive',
      loginTop: 'buttonTop',
      createBtn: 'btnlogin',
      loginBtn: 'noDisplay',
      firstName: '',
      error: 0,
    });
  };

  handleTopLoginButton = (event) => {
    event.preventDefault();
    this.setState({
      signUpTop: 'buttonTop',
      loginTop: 'buttonTopActive',
      createBtn: 'noDisplay',
      loginBtn: 'btnlogin',
      firstName: 'noDisplay',
      error: 0,
    });
  };

  handleEmail = (event) => {
    this.setState({ emailInput: event.target.value });
  };

  handlePassword = (event) => {
    this.setState({ passwordInput: event.target.value });
  };

  handleFirstName = (event) => {
    this.setState({ firstnameInput: event.target.value });
  };

  handleLogin = (event) => {
    event.preventDefault();
    this.setState({ loadingImage: 'loadingImage' });

    axios
      .post('https://warm-inlet-95424.herokuapp.com/api/auth/login', {
        email: this.state.emailInput.toLowerCase(),
        password: this.state.passwordInput,
      })
      .then(
        (response) => {
          global.email = this.state.emailInput.toLowerCase();
          this.setState({
            loggedIn: true,
            error: 0,
            loadingImage: 'noDisplay',
            token: response.data.token,
          });
          this.afterLogin();
        },
        (error) =>
          this.setState({
            loggedIn: false,
            error: 1,
            loadingImage: 'noDisplay',
          })
      );
  };

  handleGuest = (event) => {
    event.preventDefault();
    this.setState({ loadingImage: 'loadingImage' });

    axios
      .post('https://warm-inlet-95424.herokuapp.com/api/auth/login', {
        email: 'guest',
        password: 'guest',
      })
      .then((response) => {
        global.email = 'guest';

        this.setState({
          loggedIn: true,
          emailInput: 'guest',
          loadingImage: 'noDisplay',
          token: response.data.token,
        });
        this.afterLogin();
      });
  };

  handleSignUp = (event) => {
    event.preventDefault();
    this.setState({ loadingImage: 'loadingImage' });
    this.state.passwordInput !== '' &&
    this.state.firstnameInput !== '' &&
    this.state.emailInput !== ''
      ? axios
          .post('https://warm-inlet-95424.herokuapp.com/api/auth/signup', {
            email: this.state.emailInput.toLowerCase(),
            password: this.state.passwordInput,
          })
          .then(
            (response) => {
              global.email = this.state.emailInput.toLowerCase();
              global.firstName = this.state.firstnameInput;

              axios
                .post('https://warm-inlet-95424.herokuapp.com/api/auth/login', {
                  email: this.state.emailInput.toLowerCase(),
                  password: this.state.passwordInput,
                })
                .then(
                  (response) => {
                    global.email = this.state.emailInput.toLowerCase();
                    this.setState({
                      loggedIn: true,
                      error: 0,
                      loadingImage: 'noDisplay',
                      token: response.data.token,
                    });
                    axios.post(
                      'https://warm-inlet-95424.herokuapp.com/api/stuff',
                      {
                        id: '',
                        weight: 0,
                        date: 0,
                        goal: 0,
                        email: global.email,
                        username: global.firstName,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${response.data.token}`,
                        },
                      }
                    );
                    this.afterLogin();
                  },
                  (error) =>
                    this.setState({
                      loggedIn: false,
                      error: 1,
                      loadingImage: 'noDisplay',
                    })
                );
            },
            (error) => this.setState({ loggedIn: false, error: 3 })
          )
      : this.setState({ error: 2, loadingImage: 'noDisplay' });
  };

  render() {
    const weightItems = this.state.todos.map((item) => (
      <WeightItem
        item={item}
        parentCallback={this.callbackFunction}
        token={this.state.token}
      />
    ));

    return (
      <div>
        <div className={this.state.loadingImage}>
          <Loading />
        </div>
        <Login
          loggedIn={this.state.loggedIn}
          signUpTop={this.state.signUpTop}
          loginTop={this.state.loginTop}
          error={this.state.error}
          firstName={this.state.firstName}
          firstnameInput={this.state.firstnameInput}
          email={this.state.email}
          emailInput={this.state.emailInput}
          password={this.state.password}
          passwordInput={this.state.passwordInput}
          createBtn={this.state.createBtn}
          loginBtn={this.state.loginBtn}
          handleTopSignUpButton={this.handleTopSignUpButton}
          handleTopLoginButton={this.handleTopLoginButton}
          handleFirstName={this.handleFirstName}
          handleEmail={this.handleEmail}
          handlePassword={this.handlePassword}
          handleSignUp={this.handleSignUp}
          handleLogin={this.handleLogin}
          handleGuest={this.handleGuest}
        />

        <div className={this.state.loggedIn === true ? 'App' : 'noDisplay'}>
          <div className='mainBox'>
            <h6 className='motivation'>
              If you can conquer yourself {this.state.username}, you can conquer
              Everest
            </h6>
            <button className='btn' onClick={this.handleGoalButton}>
              GOAL: {this.state.goalInput} kg
            </button>
            <form className={this.state.goalFormStatus}>
              <input
                type='text'
                name='goal'
                value={this.state.goalInput}
                onChange={this.handleGoal}
              />
              <button className='formButton' onClick={this.handleGoalOk}>
                OK
              </button>
            </form>

            <button className='btn' onClick={this.handleAddForm}>
              CURRENT WEIGHT: {this.state.currentWeight} kg{' '}
            </button>

            <form className={this.state.formStatus}>
              <h2>{currentWeight} kg</h2>
              <input
                type='text'
                name='weight'
                placeholder='Weight'
                value={this.state.weightInput}
                onChange={this.handleWeight}
              />
              <br />
              <input
                type='date'
                name='date'
                placeholder='Date'
                value={this.state.DateInput}
                onChange={this.handleDate}
              />
              <br />
              <button className='formButton' onClick={this.handleOK}>
                OK
              </button>
              <button className='formButton' onClick={this.handleCancel}>
                CANCEL
              </button>
            </form>
            <div className={classes.graphContainer}>
              <canvas id='myChart' ref={this.chartRef} />
            </div>
            <h6
              className={
                this.state.currentWeight !== '' && this.state.goalInput !== ''
                  ? ''
                  : 'noDisplay'
              }>
              {Math.pow(
                Math.pow(this.state.currentWeight - this.state.goalInput, 2),
                0.5
              )}
              {this.state.currentWeight !== '' && this.state.goalInput !== ''
                ? ' kg difference remain to reach your goal'
                : ''}{' '}
            </h6>
            <br />
            <div className='history'>{weightItems}</div>
          </div>
        </div>
      </div>
    );
  }
}
