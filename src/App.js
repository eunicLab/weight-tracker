import React from 'react';
import Login from './Login.js';
import WeightApp from './WeightApp.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      email: '',
      firstName: ''
    };
  }

  callbackFunction = childData => {
    this.setState({ data: childData });
  };

  callbackFunction2 = childEmail => {
    this.setState({ email: childEmail });
  };
  callbackFunction3 = childFirstName => {
    this.setState({ firstName: childFirstName });
  };

  render() {
    return (
      <div>
        <Login
          parentCallback={this.callbackFunction}
          parentCallback2={this.callbackFunction2}
          parentCallback3={this.callbackFunction3}
          parentCallback4={this.callbackFunction4}
        />

        <WeightApp
          dataFromParent={this.state.data}
          emailFromParent={this.state.email}
          firstNameFromParent={this.state.firstName}
        />
      </div>
    );
  }
}

export default App;
