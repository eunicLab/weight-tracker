import React, { PureComponent } from 'react'
import Chart from "chart.js";
import classes from "./App.css";



let myLineChart;

export default class LineGraph extends PureComponent {
    chartRef = React.createRef();



    constructor(){
    super()
    global.Lweight = [] 
    global.Ldate =[]
    global.allInputs=[]
    global.allWeightInputs =[]
    global.allGoalInputs =[]
    global.allDateInputs =[]
    global.counter =0
    global.currentWeight=""
    global.difference=""

    this.state ={
                  formStatus:"noDisplay",
                  weightInput:"",
                  DateInput:"",
                  goalInput:"",
                  chartData:{},
                  goalFormStatus:"noDisplay"
                }


    this.handleAddForm = this.handleAddForm.bind(this)
    this.handleOK = this.handleOK.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleWeight = this.handleWeight.bind(this)
    this.handleDate = this.handleDate.bind(this)
    this.handleGoal = this.handleGoal.bind(this)
    this.handleGoalOk = this.handleGoalOk.bind(this)
    this.handleGoalButton=this.handleGoalButton.bind(this)
  }




componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }



    
    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        const { data, average, labels } = this.props;
        if (typeof myLineChart !== "undefined") myLineChart.destroy();

        
        myLineChart = new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: global.Ldate,
                datasets: [
                    {
                        label:'Weight',
                        data:global.Lweight, 
                        backgroundColor:[
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 99, 132, 0.6)'
                          ]

                    },
                    {
                      label:'Goal',
                      data:global.allGoalInputs,
                      backgroundColor:[
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(153, 102, 255, 0.6)',
                          'rgba(255, 206, 86, 0.6)',
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(255, 159, 64, 0.6)',
                          'rgba(255, 99, 132, 0.6)'
                          ]
                    }
                ]
            },
            options: {
                //Customize chart options
                responsive: true,
                legend: {
                position: 'bottom'
                },
                
            }
        });
    }



 handleAddForm(event)
  {
      event.preventDefault();
      this.setState({
                      formStatus:"formStyle",
                      weightInput:"",
                      DateInput:""
                    })
  }



  handleOK(event){
    event.preventDefault();
    if(this.state.weightInput!=="" && this.state.DateInput!==""){
    global.allWeightInputs=this.state.weightInput
    global.allDateInputs[global.counter]=this.state.DateInput
    global.allInputs[global.counter]= {weight:this.state.weightInput, date:this.state.DateInput}
    let i=0
    for(i=0; i<=global.allInputs.length;i++){global.allGoalInputs[i]=this.state.goalInput}
    console.log(global.allInputs)

    global.allInputs.sort(function(a, b){
    var dateA=new Date(a.date), dateB=new Date(b.date)
    return dateA-dateB //sort by date ascending
})
    console.log(global.allInputs)
     
    for (i=0;i<global.allInputs.length;i++){
    global.Lweight[i]=global.allInputs[i].weight
    global.Ldate[i] = global.allInputs[i].date
    console.log(global.Lweight)
    console.log(global.Ldate)
  };

    global.counter++
    this.setState({formStatus:"noDisplay"                             
  })
    global.currentWeight = global.Lweight[global.Lweight.length-1]
    if(this.state.goalInput>global.currentWeight){
    global.difference = this.state.goalInput - global.currentWeight
  }else{global.difference = global.currentWeight-this.state.goalInput}

  }
  else{alert("one or more fields required")}


    

  }

  handleCancel(event){
    event.preventDefault();
    this.setState({formStatus:"noDisplay"})
  }

handleWeight(event)
    {
      this.setState({ weightInput: event.target.value})
    }

handleDate(event)
    {
      this.setState({ DateInput: event.target.value})
    }

handleGoal(event)
{
    event.preventDefault();
      this.setState({ goalInput: event.target.value})
    
}

handleGoalOk(event)
{
    event.preventDefault();
    let i=0
    for(i=0; i<=global.allInputs.length;i++){global.allGoalInputs[i]=this.state.goalInput}
    this.setState({goalFormStatus:"noDisplay"})
    if(this.state.goalInput>global.currentWeight){
    global.difference = this.state.goalInput - global.currentWeight
  }else{global.difference = global.currentWeight-this.state.goalInput}

}

handleGoalButton(event){
  this.setState({goalFormStatus: "formStyle"})
}








    render() {
        return (
          <div className="App">
      <header className="App-header">
      <div className ="mainBox">
      <h6 className="motivation">If you can conquer yourself, you can conquer Everest</h6>
      <button className = "btn" onClick={this.handleGoalButton}>GOAL: {this.state.goalInput} kg</button>
      <form className={this.state.goalFormStatus}>
      <input type="text" name="goal" value={this.state.goalInput} onChange={this.handleGoal}/>
       <button className="formButton" onClick={this.handleGoalOk} >OK</button>
      </form>


      <button className = "btn" onClick={this.handleAddForm}>CURRENT WEIGHT: {global.currentWeight} kg</button>

       <form className = {this.state.formStatus}>
          <h2>{global.currentWeight} kg</h2>
          <input type="text" name="weight" placeholder="Weight" value={this.state.weightInput} onChange={this.handleWeight}/><br/>
          <input type="date" name="date" placeholder="Date" value={this.state.DateInput} onChange={this.handleDate}/><br/>
          <button className="formButton" onClick={this.handleOK}>OK</button>
          <button className="formButton" onClick={this.handleCancel}>CANCEL</button>
        </form>
            <div className={classes.graphContainer}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
            <h6 className ={global.currentWeight !=="" && this.state.goalInput !==""?"":"noDisplay"}>{global.difference}{global.currentWeight !=="" && this.state.goalInput !==""? " kg difference remain to reach your goal": ""} </h6>
        <button className= "btn"onClick={this.handleAddForm}>ADD NEW ENTRY</button>
      <h6>Last Modified 15 Dec 2019</h6>
      </div>
        
      </header>
    </div>
        )
    }
}