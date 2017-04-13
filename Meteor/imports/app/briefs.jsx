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
        currentData:null,
        lineGraphLabels:null,
        lineGraphData: null,
        loading: true
      }

      this.loadData = this.loadData.bind(this);
      this.createTable = this.createTable.bind(this);

      this.createLineGraph = this.createLineGraph.bind(this);
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
      var newCurrData={};
      var newLineGraphData = {};
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
          newLineGraphData[newProps.status.selectedStates[0]] =self.createLineGraph(res);
          self.setState({lineGraphData:newLineGraphData});
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

    createLineGraph(data) {
      console.log(data);
      var setArray = new Array();
      var labelArray = new Array();
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
        var currMonthData = curr.RegionalData[0].Data;
        for (j=0;j<currMonthData.length;j++){
          dataSet.data.push(currMonthData[j].Turnover);
          if (this.state.lineGraphLabels == null){
            labelArray.push(currMonthData[j].Date.slice(0,-3));
          }
        }
        if (this.state.lineGraphLabels == null) this.setState({lineGraphLabels:labelArray});
        setArray.push(dataSet);
      }
      return setArray;
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

          // var data = {
          //     labels: ["January", "February", "March", "April", "May", "June", "July"],
          //     datasets: [
          //         {
          //           label: "My First dataset",
          //     			fillColor: "rgba(220,220,220,0.2)",
          //     			strokeColor: "rgba(220,220,220,1)",
          //     			pointColor: "rgba(220,220,220,1)",
          //     			pointStrokeColor: "#fff",
          //     			pointHighlightFill: "#fff",
          //     			pointHighlightStroke: "rgba(220,220,220,1)",
          //     			data: [65, 59, 80, 81, 56, 55, 40]
          //         },
          //         {
          //           label: "My Second dataset",
          //     			fillColor: "rgba(151,187,205,0.2)",
          //     			strokeColor: "rgba(151,187,205,1)",
          //     			pointColor: "rgba(151,187,205,1)",
          //     			pointStrokeColor: "#fff",
          //     			pointHighlightFill: "#fff",
          //     			pointHighlightStroke: "rgba(151,187,205,1)",
          //     			data: [28, 48, 40, 19, 86, 27, 90]
          //         }
          //     ]
          // };
          console.log(this.state.lineGraphData);
          var data = {
            labels: this.state.lineGraphLabels,
            datasets:this.state.lineGraphData[this.state.currentStates[0]]
          }

          console.log(data);
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
