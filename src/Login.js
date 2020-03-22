import React from 'react';
import axios from 'axios';
import './App.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    global.email = '';
    global.error = 0;
    global.firstName = '';
    this.state = {
      createBtn: 'btnlogin',
      loginBtn: 'noDisplay',
      signUpTop: 'buttonTopActive',
      loginTop: 'buttonTop',
      firstName: '',
      loggedIn: false,
      emailInput: '',
      passwordInput: '',
      firstnameInput: '',
      error: 0
    };
  }

  handleTopSignUpButton = event => {
    event.preventDefault();
    this.setState({
      signUpTop: 'buttonTopActive',
      loginTop: 'buttonTop',
      createBtn: 'btnlogin',
      loginBtn: 'noDisplay',
      firstName: '',
      error: 0
    });
  };

  handleTopLoginButton = event => {
    event.preventDefault();
    this.setState({
      signUpTop: 'buttonTop',
      loginTop: 'buttonTopActive',
      createBtn: 'noDisplay',
      loginBtn: 'btnlogin',
      firstName: 'noDisplay',
      error: 0
    });
  };

  handleEmail = event => {
    this.setState({ emailInput: event.target.value });
  };

  handlePassword = event => {
    this.setState({ passwordInput: event.target.value });
  };

  handleFirstName = event => {
    this.setState({ firstnameInput: event.target.value });
  };

  handleLogin = event => {
    event.preventDefault();

    axios
      .post('https://warm-inlet-95424.herokuapp.com/api/auth/login', {
        email: this.state.emailInput.toLowerCase(),
        password: this.state.passwordInput
      })
      .then(
        response => {
          global.email = this.state.emailInput.toLowerCase();
          this.setState({ loggedIn: true, error: 0 });
          this.sendData();
          this.sendEmail();
        },
        error => this.setState({ loggedIn: false, error: 1 })
      );
  };

  handleGuest = event => {
    event.preventDefault();

    axios
      .post('https://warm-inlet-95424.herokuapp.com/api/auth/login', {
        email: 'guest',
        password: 'guest'
      })
      .then(response => {
        global.email = 'guest';

        this.setState({ loggedIn: true });
        this.sendData();
        this.sendEmail();
      });
  };

  handleSignUp = event => {
    event.preventDefault();
    this.state.passwordInput !== '' &&
    this.state.firstnameInput !== '' &&
    this.state.emailInput !== ''
      ? axios
          .post('https://warm-inlet-95424.herokuapp.com/api/auth/signup', {
            email: this.state.emailInput.toLowerCase(),
            password: this.state.passwordInput
          })
          .then(
            response => {
              global.email = this.state.emailInput.toLowerCase();
              global.firstName = this.state.firstnameInput;
              this.setState({ loggedIn: true, error: 0 });
              this.sendData();
              this.sendEmail();
              this.sendFirstName();

              axios.post('https://warm-inlet-95424.herokuapp.com/api/stuff', {
                id: '',
                weight: 0,
                date: 0,
                goal: 0,
                email: global.email,
                username: global.firstName
              });
            },
            error => this.setState({ loggedIn: false, error: 3 })
          )
      : this.setState({ error: 2 });
  };

  sendData = () => {
    this.props.parentCallback(this.state.loggedIn);
  };
  sendEmail = () => {
    this.props.parentCallback2(global.email);
  };
  sendFirstName = () => {
    this.props.parentCallback3(global.firstName);
  };

  render() {
    return (
      <div className={this.state.loggedIn ? 'noDisplay' : 'fullBackground'}>
        <form>
          <button
            className={this.state.signUpTop}
            onClick={this.handleTopSignUPButton}>
            Sign Up
          </button>
          <button
            className={this.state.loginTop}
            onClick={this.handleTopLoginButton}>
            Log in
          </button>

          <p className='error'>
            {this.state.error === 1 && !this.state.loggedIn
              ? 'Incorrect email address or password'
              : this.state.error === 2 && !this.state.loggedIn
              ? 'Required field empty'
              : this.state.error === 3 && !this.state.loggedIn
              ? 'There is already an account with this email address'
              : ''}
          </p>

          <input
            name='firstName'
            placeholder='First Name'
            className={this.state.firstName}
            value={this.state.firstnameInput}
            onChange={this.handleFirstName}
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            className={this.state.email}
            value={this.state.emailInput}
            onChange={this.handleEmail}
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            className={this.state.password}
            value={this.state.passwordInput}
            onChange={this.handlePassword}
          />
          <button className={this.state.createBtn} onClick={this.handleSignUp}>
            Create Account
          </button>
          <button className={this.state.loginBtn} onClick={this.handleLogin}>
            Log in
          </button>
          <h5>
            Continue as{' '}
            <button className='btnlogin' onClick={this.handleGuest}>
              Guest
            </button>
          </h5>
        </form>
      </div>
    );
  }
}
export default Login;
