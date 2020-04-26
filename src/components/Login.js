import React from 'react';
import '../App.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className={this.props.loggedIn ? 'noDisplay' : 'fullBackground'}>
          <form>
            <button
              className={this.props.signUpTop}
              onClick={this.props.handleTopSignUPButton}>
              Sign Up
            </button>
            <button
              className={this.props.loginTop}
              onClick={this.props.handleTopLoginButton}>
              Log in
            </button>

            <p className='error'>
              {this.props.error === 1 && !this.props.loggedIn
                ? 'Incorrect email address or password'
                : this.props.error === 2 && !this.props.loggedIn
                ? 'Required field empty'
                : this.props.error === 3 && !this.props.loggedIn
                ? 'There is already an account with this email address'
                : ''}
            </p>

            <input
              name='firstName'
              placeholder='First Name'
              className={this.props.firstName}
              value={this.props.firstnameInput}
              onChange={this.props.handleFirstName}
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              className={this.props.email}
              value={this.props.emailInput}
              onChange={this.props.handleEmail}
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              className={this.props.password}
              value={this.props.passwordInput}
              onChange={this.props.handlePassword}
            />
            <button
              className={this.props.createBtn}
              onClick={this.props.handleSignUp}>
              Create Account
            </button>
            <button
              className={this.props.loginBtn}
              onClick={this.props.handleLogin}>
              Log in
            </button>
            <h5>
              Continue as{' '}
              <button className='btnlogin' onClick={this.props.handleGuest}>
                Guest
              </button>
            </h5>
          </form>
        </div>
      </div>
    );
  }
}
export default Login;
