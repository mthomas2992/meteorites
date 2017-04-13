import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

var LineChart = require("react-chartjs").Line;
var PieChart = require("react-chartjs").Pie;

import Select from 'react-select';

class Briefs extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        currentStates: this.props.status.selectedStates,
        currentIndustry: this.props.status.industry,
        currentTimePeriodStart: this.props.status.timePeriodStart,
        currentTimePeriodEnd: this.props.status.timePeriodEnd,
        currentStatesData: null,
        currentData:null,
        lineGraphLabels:null,
        lineGraphData: null,
        pieGraphData:null,
        loading: true
      }

      this.loadData = this.loadData.bind(this);
      this.createTable = this.createTable.bind(this);

      this.formatResponse = this.formatResponse.bind(this);
    };

    componentWillReceiveProps(nextProps){
      this.loadData(nextProps);
    }

    componentWillMount(){
      this.loadData(this.props);
    };

    selectChange(option){
      console.log(option);
      this.props.changeSelectedStates([option.value]);
      //this.setState({currentStates:[option.value]});
    }

    loadData(newProps){
      console.log("called Loading" );
      this.setState({loading:true});
      console.log(newProps);
      this.setState({currentStates:newProps.status.selectedStates,currentIndustry:newProps.status.industry,currentTimePeriodStart:newProps.status.timePeriodStart,currentTimePeriodEnd:newProps.status.timePeriodEnd})
      var newCurrStateData = {};
      var newCurrData={};
      var newLineGraphData = {};
      var newPieGraphData ={};
      var self =this;
      for (i=0;i<newProps.status.selectedStates.length;i++){
        Meteor.call('getAllTotalsOverTimeRetail',newProps.status.selectedStates[i],newProps.status.timePeriodStart,newProps.status.timePeriodEnd, function (err,res){
          newCurrStateData[res.state] = res.data;
          self.setState({currentStatesData:newCurrStateData});

        });

        Meteor.call('getRetailTurnover',newProps.status.selectedStates[i],"Total,Food,Householdgood,ClothingFootwareAndPersonalAccessory,DepartmentStores,CafesResturantsAndTakeawayFood,Other",newProps.status.timePeriodStart,newProps.status.timePeriodEnd, function(err,res){
          newCurrData[newProps.status.selectedStates[0]] = res; //need to change this TODO
          self.setState({currentData:newCurrData});
          //call interpolation for tables ands stuff
          console.log(newProps.status.selectedStates[0]);
          var formattedResponses = self.formatResponse(res);
          newLineGraphData[newProps.status.selectedStates[0]] =formattedResponses.lineGraph;
          newPieGraphData[newProps.status.selectedStates[0]] = formattedResponses.pieGraph;
          self.setState({lineGraphData:newLineGraphData, pieGraphData:newPieGraphData});
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

    formatResponse(data) {
      console.log(data);
      var lineArray = new Array();
      var labelArray = new Array();
      var pieArray = new Array();

      for (i=0;i<data.length;i++){
        var curr = data[i];
        var dataSet= {
          label: curr.RetailIndustry,
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: []
        }
        var pieDataSet = {
          value: 0,
      		color:"rgba(220,220,220,0.5)",
      		highlight: "#FF5A5E",
      		label: curr.RetailIndustry
        }
        var total =0;
        var currMonthData = curr.RegionalData[0].Data;
        for (j=0;j<currMonthData.length;j++){
          dataSet.data.push(currMonthData[j].Turnover);
          total = total +currMonthData[j].Turnover;
          if (this.state.lineGraphLabels == null){
            labelArray.push(currMonthData[j].Date.slice(0,-3));
          }
        }
        pieDataSet.value =total;
        if (this.state.lineGraphLabels == null) this.setState({lineGraphLabels:labelArray});
        lineArray.push(dataSet);
        if (curr.RetailIndustry!="Total")pieArray.push(pieDataSet);
      }
      return {lineGraph:lineArray,pieGraph:pieArray};
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

          var lineData = {
            labels: this.state.lineGraphLabels,
            datasets:this.state.lineGraphData[this.state.currentStates[0]]
          }
          console.log(this.state.pieGraphData);
          return(<div className= "col-md-12">
                  <div id = "singularTitle" className="row">
                    <div id = "actualTitle">Retail Turnover Data for {this.state.currentStates[0]}</div>
                    <div id = "prompt" className= "col-md-4 col-md-offset-1"> Select state : </div>
                    <div id = "stateSelectorID" className = "col-md-2">

                      <Select
                      name= "state-selector"
                      value= {this.state.currentStates[0]}
                      options = {[{value:"AUS",label:"AUS"},{value:"NSW",label:"NSW"},{value:"VIC",label:"VIC"},{value:"NT",label:"NT"},{value:"WA",label:"WA"},{value:"SA",label:"SA"},
                      {value:"ACT",label:"ACT"},{value:"TAS",label:"TAS"},{value:"QLD",label:"QLD"}]}
                      clearable = {false}
                      onChange = {this.selectChange.bind(this)}
                      />
                    </div>
                  </div>
                  <div id= "singularGraphSection" className="row">
                    <div className = "col-md-6">
                      <LineChart data={lineData} width = {(window.innerWidth/100)*25} height = {(window.innerHeight/100)*40}/>
                    </div>
                    <div className = "col-md-6">
                      <PieChart data={this.state.pieGraphData[this.state.currentStates[0]]} width = {(window.innerWidth/100)*23} height = {(window.innerHeight/100)*40}/>
                    </div>
                  </div>
                  <div id= "singularTableData" className="row">

                    {dataTable}
                  </div>

                </div>);
        } else {
          return (<div> Error </div>);
        }
      }
    }
}

export default Briefs;
