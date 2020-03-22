import React from 'react';
import edit from './edit_icon.png';
import delete_icon from './delete_icon.png';
import axios from 'axios';
import './App.css';

class WeightItem extends React.Component {
  constructor(props) {
    super(props);
    global.updateCount = 0;
    this.state = {
      weightInput: '',
      dateInput: '',
      editBoxStatus: 'noDisplay',
      updateCount: global.updateCount
    };
  }

  handleUpdate = event => {
    event.preventDefault();
    const upDatedList = {
      weight: this.state.weightInput,
      date: this.state.dateInput,
      goal: this.props.item.goal
    };

    axios
      .put(
        'https://warm-inlet-95424.herokuapp.com/api/stuff/' +
          this.props.item._id,
        upDatedList
      )
      .then(res => {
        global.updateCount++;
        this.setState({ updateCount: global.updateCount });
        this.sendData();
      });
    this.setState({
      editBoxStatus: 'noDisplay'
    });
  };

  handleDelete = event => {
    event.preventDefault();
    axios
      .delete(
        'https://warm-inlet-95424.herokuapp.com/api/stuff/' +
          this.props.item._id
      )
      .then(res => {
        global.updateCount++;
        this.setState({ updateCount: global.updateCount });
        this.sendData();
      });
  };

  handleEdit = event => {
    event.preventDefault();
    this.setState({
      weightInput: this.props.item.weight,
      dateInput: this.props.item.date,
      editBoxStatus: 'formStyle'
    });
  };
  handleDateChange = event => {
    this.setState({ dateInput: event.target.value });
  };
  handleWeightChange = event => {
    this.setState({ weightInput: event.target.value });
  };

  handleCancel = event => {
    event.preventDefault();
    this.setState({ editBoxStatus: 'noDisplay' });
  };
  sendData = () => {
    this.props.parentCallback(this.state.updateCount);
  };

  render() {
    return (
      <div className='container'>
        <div className='weightItem'>
          <div className='outputWeight'>{this.props.item.weight}</div>
          <div className='outputDate'>{this.props.item.date}</div>

          <img
            src={edit}
            className='iconEdit'
            alt='An edit button'
            onClick={this.handleEdit}
          />
          <img
            src={delete_icon}
            className='iconDelete'
            alt='A delete button'
            onClick={this.handleDelete}
          />
        </div>

        <form className={this.state.editBoxStatus}>
          <input
            name='WeightInput'
            value={this.state.weightInput}
            onChange={this.handleWeightChange}
          />
          <br />
          <input
            type='date'
            name='date'
            value={this.state.dateInput}
            onChange={this.handleDateChange}
          />
          <br />
          <button className='formButton' onClick={this.handleUpdate}>
            Update
          </button>
          <button className='formButton' onClick={this.handleCancel}>
            CANCEL
          </button>
        </form>
      </div>
    );
  }
}

export default WeightItem;
