import React from 'react';
import ReactLoading from 'react-loading';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: undefined
    };
  }
  render() {
    return (
      <div>
        {!this.state.done ? (
          <ReactLoading type={'spin'} color={'#0099cc'} />
        ) : (
          <h1>hello world</h1>
        )}
      </div>
    );
  }
}
