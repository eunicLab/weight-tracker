import React, { PureComponent } from 'react'
import Chart from "chart.js";
import classes from "./App.css";
import axios from 'axios';



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
   


    this.state ={
                  formStatus:"noDisplay",
                  weightInput:"",
                  DateInput:"",
                  goalInput:"",
                  chartData:{},
                  goalFormStatus:"noDisplay",
                  todos:"",
                  currentWeight:"",


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

   axios.get('https://warm-inlet-95424.herokuapp.com/api/stuff',)


.then(response=>{ 

    if(response.data.length>0) {

    response.data.sort(function(a, b){
    var dateA=new Date(a.date), dateB=new Date(b.date)
    return dateA-dateB //sort by date ascending
})

}



this.setState({todos:response.data,})



 let i=0
for (i=0;i<this.state.todos.length;i++){
    global.Lweight[i]=this.state.todos[i].weight
    global.Ldate[i] = this.state.todos[i].date
    global.allGoalInputs[i] = this.state.todos[this.state.todos.length-1].goal
  }

this.setState({

  
  goalInput:this.state.todos[this.state.todos.length-1].goal,
 currentWeight:this.state.todos[this.state.todos.length-1].weight
})




   this.buildChart();

    console.log(global.Lweight)
    console.log(global.Ldate)
  
 })
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
    global.allInputs[global.counter]= { id:"", goal:this.state.goalInput, weight:this.state.weightInput, date:this.state.DateInput,}

         axios.post('https://warm-inlet-95424.herokuapp.com/api/stuff', global.allInputs[global.counter])
       
    .then(res=> {window.location = '/';}
)
   




    global.counter++
    this.setState({formStatus:"noDisplay"                             
  })
    global.currentWeight = global.Lweight[global.Lweight.length-1]
    

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


const upDatedList={
    goal:this.state.goalInput,
  }


axios.put('https://warm-inlet-95424.herokuapp.com/api/stuff/'+this.state.todos[this.state.todos.length-1]._id, upDatedList)
  .then(res=>{window.location = '/';
});


    let i=0
    for(i=0; i<=global.allInputs.length;i++){global.allGoalInputs[i]=this.state.goalInput}
    this.setState({goalFormStatus:"noDisplay"})

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


      <button className = "btn" onClick={this.handleAddForm}>CURRENT WEIGHT: {this.state.currentWeight} kg </button>

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
            <h6 className ={this.state.currentWeight !=="" && this.state.goalInput !==""?"":"noDisplay"}>{Math.pow((Math.pow((this.state.currentWeight-this.state.goalInput),2)),0.5)}{this.state.currentWeight !=="" && this.state.goalInput !==""? " kg difference remain to reach your goal": ""} </h6>
      </div>
        
      </header>
    </div>
        )
    }
}