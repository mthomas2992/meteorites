import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

var LineChart = require("react-chartjs").Line;
var PieChart = require("react-chartjs").Pie;

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import Impact from '/imports/app/impact.jsx';

var transforms = {RetailTurnover:{topLevelCategory:"RetailIndustry",dataValue:"Turnover"},MerchandiseExports:{topLevelCategory:"Commodity",dataValue:"Value"}};

var colours=["rgba(150,0,0,","rgba(0,150,0,","rgba(0,0,150,","rgba(250,200,150,","rgba(150,200,250,",
            "rgba(250,0,150,","rgba(200,250,150,","rgba(220,220,220,","rgba(100,200,150,","rgba(200,150,100,"];

class Briefs extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        timePeriodStart : "2015-09-09",
        timePeriodEnd : "2016-09-09",
        industry:"RetailTurnover",
        momentStart:null,
        momentEnd:null,
        currState:"AUS",
        currentIndustry: this.props.status.industry,
        currentTimePeriodStart: this.props.status.timePeriodStart,
        currentTimePeriodEnd: this.props.status.timePeriodEnd,
        currentData:null,
        lineGraphLabels:null,
        lineGraphData: null,
        pieGraphData:null,
        tableData:null,
        loading: true,
      }

      this.loadData = this.loadData.bind(this);

      this.formatResponse = this.formatResponse.bind(this);
    };


    handleStartDateChange(date){
      this.setState({momentStart:date})
      this.setState({timePeriodStart:date.format('YYYY-MM-DD')});
    }

    handleEndDateChange(date){
      this.setState({momentEnd:date})
      this.setState({timePeriodEnd:date.format('YYYY-MM-DD')});
    }

    selectIndustryChange(option){
      this.setState({industry:option.value});
      console.log("PRE LOAD INDUSTRY CHANGED to "+option.value);
      this.loadData(this.props,this.state.currState);
      console.log("INDUSTRY CHANGED to "+option.value);
      console.log("CURRENT INDUSTRY is "+this.state.industry);
    }

    componentWillMount(){
      var startDateSplit = this.state.timePeriodStart.split('-');
      var endDateSplit = this.state.timePeriodEnd.split('-');
      var newStartMoment = new Moment(new Date(startDateSplit[0],startDateSplit[1]-1,startDateSplit[2]));
      var newEndMoment = new Moment(new Date(endDateSplit[0],endDateSplit[1]-1,endDateSplit[2]));
      this.setState({momentStart:newStartMoment,momentEnd:newEndMoment});
      this.loadData(this.props,this.state.currState);
    };

    addPanel(){
      var currPanel = this.state.panelCount;
      if (currPanel<4){
        this.setState({panelCount:currPanel+1});
      }
    }

    removePanel(){
      var currPanel = this.state.panelCount;
      if (currPanel>1){
        this.setState({panelCount:currPanel-1});
      }
    }

    onBreakpointChange(breakpoint){
      // console.log(breakpoint)
    }

    layoutChange(layout){
      for (kl=0;kl<layout.length;kl++){
        layout[kl].w=6;
        // if (kl%2 != 0 && kl!=0) layout[kl].x=6;
      }
    }


    // componentWillReceiveProps(nextProps){
    //   this.loadData(nextProps,this.state.currState);
    // }

    // componentWillMount(){
    //     this.loadData(this.props,this.state.currState);
    // };

    selectChange(option){
      this.setState({currState:option.value});
      this.loadData(this.props,option.value);
    }

    loadData(newProps,newState){ //get rid of new props once state is fixed then replace newprops with stat.whatever

      this.setState({loading:true});

      //this.setState({currentIndustry:newProps.status.industry,currentTimePeriodStart:newProps.status.timePeriodStart,currentTimePeriodEnd:newProps.status.timePeriodEnd})

      var newCurrStateData = {};
      var newCurrData={};
      var newLineGraphData = {};
      var newPieGraphData ={};
      var newTableData={};
      var self =this;

      var functionCall = "getRetailTurnover";
      var categories = "Total,Food,Householdgood,ClothingFootwareAndPersonalAccessory,DepartmentStores,CafesResturantsAndTakeawayFood,Other";

      if (this.state.industry == "MerchandiseExports"){
        functionCall = "getMerchandiseExports";
        categories = "Total,FoodAndLiveAnimals,BeveragesAndTobacco,CrudMaterialAndInedible,MineralFuelLubricentAndRelatedMaterial,AnimalAndVegitableOilFatAndWaxes,ChemicalsAndRelatedProducts,ManufacutedGoods,MachineryAndTransportEquipments,OtherManucacturedArticles,Unclassified";
      }
      console.log(functionCall);
      Meteor.call(functionCall,newState,categories,this.state.currentTimePeriodStart,this.state.currentTimePeriodEnd, function(err,res){
        newCurrData[newState] = res; //need to change this TODO
        self.setState({currentData:newCurrData});
        //call interpolation for tables ands stuff
        var formattedResponses = self.formatResponse(res);
        newLineGraphData[newState] =formattedResponses.lineGraph;
        newPieGraphData[newState] = formattedResponses.pieGraph;
        newTableData[newState] = formattedResponses.tableData;
        self.setState({lineGraphData:newLineGraphData, pieGraphData:newPieGraphData, tableData:newTableData});
        self.setState({loading:false}); //only good when there is just one state
      });

    }

    formatResponse(data) {
      var lineArray = new Array();
      var labelArray = new Array();
      var pieArray = new Array();
      var table = new Array();
      table.push(<tr><th>Sub-category</th><th>Total</th></tr>);

      for (i=0;i<data.length;i++){
        var curr = data[i];
        var dataSet= {
          label: curr[transforms[this.state.currentIndustry].topLevelCategory].substring(0,15) +"... ",
          fillColor: colours[i]+"0.2)",
          strokeColor: colours[i]+"1)",
          pointColor: colours[i]+"1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: []
        }
        var pieDataSet = {
          value: 0,
      		color:colours[i]+"0.5)",
      		highlight: "#FF5A5E",
      		label: curr[transforms[this.state.currentIndustry].topLevelCategory].substring(0,15) +"... "
        }
        var total =0;
        var currMonthData = curr.RegionalData[0].Data;
        for (j=0;j<currMonthData.length;j++){
          if (currMonthData[j][transforms[this.state.currentIndustry].dataValue] == "Data missing" || currMonthData[j][transforms[this.state.currentIndustry].dataValue] == null){
            continue;
          }
          dataSet.data.push(currMonthData[j][transforms[this.state.currentIndustry].dataValue].toFixed(2));
          total = total +currMonthData[j][transforms[this.state.currentIndustry].dataValue];
          if (i==0){
            labelArray.push(currMonthData[j].Date.slice(0,-3));
          }
        }
        pieDataSet.value =total.toFixed(2);
        if (i==0) this.setState({lineGraphLabels:labelArray});
        if (curr[transforms[this.state.currentIndustry].topLevelCategory].match(/^total/gi)){
          continue;
        } else {
          pieArray.push(pieDataSet);
          lineArray.push(dataSet);
          table.push(<tr><td>{curr[transforms[this.state.currentIndustry].topLevelCategory]}</td> <td>{total.toFixed(2)}</td></tr>);
        }
      }
      var completedTable = <table id ="singularDataTable">{table}</table>;
      return {lineGraph:lineArray,pieGraph:pieArray,tableData:completedTable};
    }

    componentDidMount(){

    };

    render() {
      if (this.state.loading){
        return (<div>Loading....</div>);
      } else {
        if (this.state.currState != null){
          var lineData = {
            labels: this.state.lineGraphLabels,
            datasets:this.state.lineGraphData[this.state.currState]
          }




          return(
            <div>
            <div id="homeTopBar" className="row">
                    <div id="frontHeader" className="col-md-4">
                      Meteoristics
                    </div>
                    <div id = "prompt" className= "col-md-1"> Select industry </div>
                    <div id = "stateSelectorID" className = "col-md-1">
                      <Select
                      name= "industry-selector"
                      value= {this.state.industry}
                      options = {[{value:"RetailTurnover",label:"Retail Turnover"},{value:"MerchandiseExports",label:"Merchandise Exports"}]}
                      clearable = {false}
                      onChange = {this.selectIndustryChange.bind(this)}
                      />
                    </div>
                    <div className="col-md-2">
                      Start Date:
                      <DatePicker
                        dateFormat="YYYY-MM-DD"
                        selected = {this.state.momentStart}
                        onChange = {this.handleStartDateChange}
                        />
                    </div>
                    <div className="col-md-2">
                      End Date:
                      <DatePicker
                        dateFormat="YYYY-MM-DD"
                        selected = {this.state.momentEnd}
                        onChange = {this.handleEndDateChange}
                        />
                    </div>
                    <div onClick={()=>{this.addPanel()}} id="addSection" className="col-md-1">
                      Add Panel
                    </div>
                    <div onClick={()=>{this.removePanel()}}id="removeSection" className="col-md-1">
                      Remove Panel
                    </div>
                  </div>
            <div className= "col-md-12">
                  <div id = "singularTitle" className="row">
                    <div id = "actualTitle">{this.state.currentIndustry} Data for {this.state.currState}</div>
                    <div id = "prompt" className= "col-md-1"> Select state : </div>
                    <div id = "stateSelectorID" className = "col-md-1">
                      <Select
                      name= "state-selector"
                      value= {this.state.currState}
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
                      <PieChart data={this.state.pieGraphData[this.state.currState]} width = {(window.innerWidth/100)*23} height = {(window.innerHeight/100)*40}/>
                    </div>
                  </div>
                  <div id= "singularTableData" className="row">

                    {this.state.tableData[this.state.currState]}
                  </div>

                </div>
                </div>);
        } else {
          return (<div> Error </div>);
        }
      }
    }
}

export default Briefs;
