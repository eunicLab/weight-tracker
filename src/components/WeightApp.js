import React from 'react';
import classes from '../App.css';
import WeightItem from './WeightItem.js';

export default class WeightApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const weightItems = this.state.todos.map((item) => (
      <WeightItem
        item={item}
        parentCallback={this.callbackFunction}
        token={this.state.token}
      />
    ));

    return (
      <div className={this.state.loggedIn === true ? 'App' : 'noDisplay'}>
        <div className='mainBox'>
          <h6 className='motivation'>
            If you can conquer yourself {this.state.username}, you can conquer
            Everest
          </h6>
          <button className='btn' onClick={this.state.handleGoalButton}>
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
            CURRENT WEIGHT: {this.state.currentWeight2} kg{' '}
          </button>

          <form className={this.state.formStatus}>
            <h2>{this.state.currentWeight} kg</h2>
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
            <button className='formButton' onClick={this.state.handleOK}>
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
    );
  }
}
