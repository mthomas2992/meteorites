import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

var LineChart = require("react-chartjs").Line;

class Briefs extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        currentStates: this.props.status.selectedStates,
        currentIndustry: this.props.status.industry,
        currentTimePeriodStart: this.props.status.timePeriodStart,
        currentTimePeriodEnd: this.props.status.timePeriodEnd,
        currentStatesData: null,
        loading: true
      }

      this.loadData = this.loadData.bind(this);
      this.createTable = this.createTable.bind(this);
    };

    componentWillReceiveProps(nextProps){
      this.loadData(nextProps);
    }

    componentWillMount(){
      this.loadData(this.props);
    };

    loadData(newProps){
      console.log("called Loading" );
      this.setState({loading:true});
      console.log(newProps);
      this.setState({currentStates:newProps.status.selectedStates,currentIndustry:newProps.status.industry,currentTimePeriodStart:newProps.status.timePeriodStart,currentTimePeriodEnd:newProps.status.timePeriodEnd})
      var newCurrStateData = {};
      var self =this;
      for (i=0;i<newProps.status.selectedStates.length;i++){
        Meteor.call('getAllTotalsOverTimeRetail',newProps.status.selectedStates[i],newProps.status.timePeriodStart,newProps.status.timePeriodEnd, function (err,res){
          newCurrStateData[res.state] = res.data;
          self.setState({currentStatesData:newCurrStateData});
          self.setState({loading:false}); //only good when there is just one state
        });
      }

    }

    createTable(state){
      var table = new Array();
      table.push(<tr><th>Sub-category</th><th>Total</th></tr>);
      console.log(Object.keys(this.state.currentStatesData[state]));
      var stateKeys = Object.keys(this.state.currentStatesData[state]);

      for (i=0;i<stateKeys.length;i++){
        if (stateKeys[i]=="Total") continue;
        table.push(<tr><td>{stateKeys[i]}</td> <td>{this.state.currentStatesData[state][stateKeys[i]].toFixed(2)}</td></tr>)
      }
      var completedTable = <table id ="singularDataTable">{table}</table>;
      return completedTable;
    };
    createLineGraphData(state){

    }

    componentDidMount(){

    };

    render() {
      if (this.state.loading){
        return (<div>Loading....</div>);
      } else {
        if (this.state.currentStates.length <=1){
          //create table from given data
          var dataTable = this.createTable(this.state.currentStates[0]);

          var data = {
              labels: ["January", "February", "March", "April", "May", "June", "July"],
              datasets: [
                  {
                    label: "My First dataset",
              			fillColor: "rgba(220,220,220,0.2)",
              			strokeColor: "rgba(220,220,220,1)",
              			pointColor: "rgba(220,220,220,1)",
              			pointStrokeColor: "#fff",
              			pointHighlightFill: "#fff",
              			pointHighlightStroke: "rgba(220,220,220,1)",
              			data: [65, 59, 80, 81, 56, 55, 40]
                  },
                  {
                    label: "My Second dataset",
              			fillColor: "rgba(151,187,205,0.2)",
              			strokeColor: "rgba(151,187,205,1)",
              			pointColor: "rgba(151,187,205,1)",
              			pointStrokeColor: "#fff",
              			pointHighlightFill: "#fff",
              			pointHighlightStroke: "rgba(151,187,205,1)",
              			data: [28, 48, 40, 19, 86, 27, 90]
                  }
              ]
          };

          console.log(this.state.currentStatesData);
          return(<div className= "col-md-12">
                  <div id = "singularTitle" className="row"> State data for {this.state.currentStates[0]}</div>
                  <div id= "singularGraphSection" className="row"> <LineChart data={data} width = {(window.innerWidth/100)*25} height = {(window.innerHeight/100)*40}/> </div>
                  <div id= "singularTableData" className="row">{dataTable}</div>

                </div>);
        } else {
          return (<div> Error </div>);
        }
      }
    }
}

export default Briefs;
