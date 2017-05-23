import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

var transforms = {RetailTurnover:{topLevelCategory:"RetailIndustry",dataValue:"Turnover"},MerchandiseExports:{topLevelCategory:"Commodity",dataValue:"Value"}};
var colours=["rgba(150,0,0,","rgba(0,150,0,","rgba(0,0,150,","rgba(250,200,150,","rgba(150,200,250,",
            "rgba(250,0,150,","rgba(200,250,150,","rgba(220,220,220,","rgba(100,200,150,","rgba(200,150,100,","rgba(10,20,100,"];

import ReactGridLayout from 'react-grid-layout';
require ('/node_modules/react-grid-layout/css/styles.css');
require ('/node_modules/react-resizable/css/styles.css');
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import SunburstChart from '/imports/app/d3test.jsx';
var PolarChart = require("react-chartjs").PolarArea;
var LineChart = require("react-chartjs").Line;


class Impact extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        layout: [
         {i: 'mainImpact', x: 0, y: 0, w: 12, h: 0.6, isResizable:false},
         {i: 'spec0', x: 0, y: 1, w: 6, h: 0.5, isResizable:false},
         {i: 'spec1', x: 0, y: 1, w: 6, h: 0.5, isResizable:false},
         {i: 'spec2', x: 6, y: 1, w: 6, h: 0.5, isResizable:false},
         {i: 'spec3', x: 6, y: 1, w: 6, h: 0.5, isResizable:false},
        ],
        areas:["Retail","MerchandiseExports"],
        impactBrief:null,
        totalRetailMonthlyData:null,
        timePeriodStart:this.props.startDate,
        timePeriodEnd:this.props.endDate
      }

      this.onBreakpointChange = this.onBreakpointChange.bind(this);
      this.layoutChange = this.layoutChange.bind(this);

      this.formatResponse = this.formatResponse.bind(this);
      this.findPercentGrowth = this.findPercentGrowth.bind(this);
      this.loadData = this.loadData.bind(this);

      this.handleStartDateChange = this.handleStartDateChange.bind(this);
      this.handleEndDateChange = this.handleEndDateChange.bind(this);
    };

    loadData(){
      console.log(this.state);
      var self = this;
      Meteor.call('getRetailTurnover',"AUS","Total,Food,Householdgood,ClothingFootwareAndPersonalAccessory,DepartmentStores,CafesResturantsAndTakeawayFood,Other",this.state.timePeriodStart,this.state.timePeriodEnd,function(err,res){
        var formatted = self.formatResponse(res,"RetailTurnover");
        self.setState({totalRetailMonthlyData:res,totalRetailMonthlyDataFormatted:formatted});
      });

      Meteor.call('getMerchandiseExports',"AUS","Total,FoodAndLiveAnimals,BeveragesAndTobacco,CrudMaterialAndInedible,MineralFuelLubricentAndRelatedMaterial,AnimalAndVegitableOilFatAndWaxes,ChemicalsAndRelatedProducts,ManufacutedGoods,MachineryAndTransportEquipments,OtherManucacturedArticles,Unclassified",this.state.timePeriodStart,this.state.timePeriodEnd,function(err,res){
        var formatted = self.formatResponse(res,"MerchandiseExports");
        self.setState({totalMerchMonthlyData:res,totalMerchMonthlyDataFormatted:formatted});
      });

      var oldStartDate = this.state.timePeriodStart.split('-');
      oldStartDate[0]=oldStartDate[0]-1;
      var oldEndDate = this.state.timePeriodEnd.split('-');
      oldEndDate[0]=oldEndDate[0]-1;
      formattedOldStartDate = oldStartDate.join("-");
      formattedOldEndDate = oldEndDate.join("-");

      Meteor.call('getRetailTurnover',"AUS","Total,Food,Householdgood,ClothingFootwareAndPersonalAccessory,DepartmentStores,CafesResturantsAndTakeawayFood,Other",formattedOldStartDate,formattedOldEndDate,function(err,res){
        var formatted = self.formatResponse(res,"RetailTurnover");
        self.setState({totalOldRetailMonthlyData:res,totalOldRetailMonthlyDataFormatted:formatted});
      });

      Meteor.call('getMerchandiseExports',"AUS","Total,FoodAndLiveAnimals,BeveragesAndTobacco,CrudMaterialAndInedible,MineralFuelLubricentAndRelatedMaterial,AnimalAndVegitableOilFatAndWaxes,ChemicalsAndRelatedProducts,ManufacutedGoods,MachineryAndTransportEquipments,OtherManucacturedArticles,Unclassified",formattedOldStartDate,formattedOldEndDate,function(err,res){
        var formatted = self.formatResponse(res,"MerchandiseExports");
        console.log(res);
        console.log(formatted);
        self.setState({totalOldMerchMonthlyData:res,totalOldMerchMonthlyDataFormatted:formatted});
      });
    }

    componentWillMount(){
      var startDateSplit = this.state.timePeriodStart.split('-');
      var endDateSplit = this.state.timePeriodEnd.split('-');
      var newStartMoment = new Moment(new Date(startDateSplit[0],startDateSplit[1]-1,startDateSplit[2]));
      var newEndMoment = new Moment(new Date(endDateSplit[0],endDateSplit[1]-1,endDateSplit[2]));
      this.setState({momentStart:newStartMoment,momentEnd:newEndMoment});
      this.loadData();
    };

    handleStartDateChange(date){
      console.log("r");
      this.setState({totalMerchMonthlyData:null,totalOldMerchMonthlyData:null,totalRetailMonthlyData:null,totalOldRetailMonthlyData:null});
      this.loadData();
      this.setState({momentStart:date});
      this.setState({timePeriodStart:date.format('YYYY-MM-DD')});

    }

    handleEndDateChange(date){
      console.log("running");
      this.setState({momentEnd:date})
      this.setState({timePeriodEnd:date.format('YYYY-MM-DD')});
      this.setState({totalMerchMonthlyData:null,totalOldMerchMonthlyData:null,totalRetailMonthlyData:null,totalOldRetailMonthlyData:null});
      this.loadData();
    }

    formatResponse(data,industry) {
      var lineArray = new Array();
      var labelArray = new Array();
      var pieArray = new Array();
      var table = new Array();
      var totals = {};
      table.push(<tr><th>Sub-category</th><th>Total</th></tr>);
      for (i=0;i<data.length;i++){
        console.log(colours[i]);
        var curr = data[i];
        var dataSet= {
          label: curr[transforms[industry].topLevelCategory],
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
      		label: curr[transforms[industry].topLevelCategory]
        }
        var total =0;
        var currMonthData = curr.RegionalData[0].Data;
        for (j=0;j<currMonthData.length;j++){
          if (currMonthData[j][transforms[industry].dataValue] == "Data missing" || currMonthData[j][transforms[industry].dataValue] == null){
            continue;
          }
          dataSet.data.push(currMonthData[j][transforms[industry].dataValue].toFixed(2));
          total = total +currMonthData[j][transforms[industry].dataValue];
          if (i==0){
            labelArray.push(currMonthData[j].Date.slice(5,-3));
          }
        }
        pieDataSet.value =total.toFixed(2);
        if (i==0) this.setState({lineGraphLabels:labelArray});
        if (curr[transforms[industry].topLevelCategory].match(/^total/gi)){
          continue;
        }
        totals[curr[transforms[industry].topLevelCategory]]=total.toFixed(2);
        pieArray.push(pieDataSet);
        lineArray.push(dataSet);
        table.push(<tr><td>{curr[transforms[industry].topLevelCategory]}</td> <td>{total.toFixed(2)}</td></tr>);
      }
      var completedTable = <table id ="singularDataTable">{table}</table>;
      return {lineGraph:lineArray,pieGraph:pieArray,tableData:completedTable,totalsData:totals};
    }

    onBreakpointChange(breakpoint){
      // console.log(breakpoint)
    }

    layoutChange(layout){
      // for (kl=0;kl<layout.length;kl++){
      //   layout[kl].w=6;
      //   // if (kl%2 != 0 && kl!=0) layout[kl].x=6;
      // }
    }

    findPercentGrowth(oldArray,newArray){
      console.log(oldArray,newArray)
      var pieGraphData = new Array();
      var totalsPercents = {}
      var i=0;
      Object.entries(oldArray).forEach(
        ([key,value]) => {
          var percentageGrowth = 1-(oldArray[key]/newArray[key]);
          percentageGrowth = percentageGrowth.toFixed(2);
          var label = key
          var colour = "rgba(0,300,"+(i+1*50)+",";
          if (percentageGrowth<0){
            label = label +"-negative --"
            colour = "rgba(300,0,"+(i+1*50)+",";
          }
          pieGraphData.push({
            value: Math.abs(percentageGrowth),
        		color:colour+"0.5)",
        		highlight: "#FF5A5E",
        		label: label
          });
          totalsPercents[key]=percentageGrowth;
          i++;
        }
      )
      return({pieGraph:pieGraphData,percents:totalsPercents});
    }

    render() {
      var layouts = {lg:this.state.layout,md:this.state.layout};

      if (this.state.totalMerchMonthlyData && this.state.totalRetailMonthlyData && this.state.totalOldRetailMonthlyData && this.state.totalOldMerchMonthlyData){
        var retailChange = this.findPercentGrowth(this.state.totalOldRetailMonthlyDataFormatted.totalsData,this.state.totalRetailMonthlyDataFormatted.totalsData);
        //will eventually add in a combination of retailChange and merchandise change when merchandise works
        console.log("formatted ", this.state.totalMerchMonthlyDataFormatted);
        var merchChange = this.findPercentGrowth(this.state.totalOldMerchMonthlyDataFormatted.totalsData,this.state.totalMerchMonthlyDataFormatted.totalsData);
        console.log(merchChange);
        var combinedChange = {pieGraph:retailChange.pieGraph.concat(merchChange.pieGraph)}; //combination will occur here
        var totalOldDataFormatted = {RetailTurnover:this.state.totalOldRetailMonthlyDataFormatted.lineGraph,MerchandiseExports:this.state.totalOldMerchMonthlyDataFormatted.lineGraph};
        var totalNewDataFormatted = {RetailTurnover:this.state.totalRetailMonthlyDataFormatted.lineGraph,MerchandiseExports:this.state.totalMerchMonthlyDataFormatted.lineGraph};
        // this.setState({totalOldDataFormatted:totalOldDataFormatted);
        var combinedPercents = {RetailTurnover:retailChange.percents,MerchandiseExports:merchChange.percents}; //change this to merchChange when it works
        var topElements ={one:{Name:null,Value:null},two:{Name:null,Value:null},three:{Name:null,Value:null},four:{Name:null,Value:null}};
        console.log(combinedPercents);
        Object.entries(combinedPercents).forEach(
          ([key1,value1]) => {
            console.log(key1);
            Object.entries(combinedPercents[key1]).forEach(
              ([key2,value2]) => {
                // console.log(key2,Math.abs(value2));
                if (Math.abs(value2)>Math.abs(topElements.one.Value)){
                  topElements.one = {Name:key2, Value:value2};
                } else if (Math.abs(value2)>Math.abs(topElements.two.Value)){
                  topElements.two = {Name:key2, Value:value2};
                } else if (Math.abs(value2)>Math.abs(topElements.three.Value)){
                  topElements.three = {Name:key2, Value:value2};
                } else if (Math.abs(value2)>Math.abs(topElements.four.Value)){
                  topElements.four = {Name:key2, Value:value2};
                }
              }
            );
          }
        );
        //now for each of the top elements we need to get their line graph data
        var specificGraphs = new Array();
        var i=0;
        Object.entries(topElements).forEach(
          ([key1,value1]) => {
            //get line graph data,push to total elements pool
            Object.entries(totalOldDataFormatted).forEach(
              ([key2,value2]) => {
                Object.entries(totalOldDataFormatted[key2]).forEach(
                  ([key3,value3]) => {
                    if (value1.Name == value3.label){
                      var newData = new Array();
                      var toBePushed = totalNewDataFormatted[key2][key3];
                      var currLabel = toBePushed.label
                      toBePushed.label = "Previous";
                      newData.push(toBePushed);
                      var newtoBePushed = value3;
                      newtoBePushed.label="Current";
                      // console.log(totalNewDataFormatted[key2][key3]);
                      // console.log(value3);
                      newData.push(newtoBePushed);
                      // console.log(newData);
                      var lineData = {
                        labels: this.state.lineGraphLabels,
                        datasets:newData
                      }
                      var currValue = "(Thousands of dollars)";
                      var possibleCategoryRetail = ["Total","Food","Householdgood","ClothingFootwareAndPersonalAccessory","DepartmentStores","CafesResturantsAndTakeawayFood","Other"]
                      if (possibleCategoryRetail.includes(currLabel)){
                        currValue = "(Millions of dollars)"
                      }
                      specificGraphs.push(<div className = "col-md-6" id = "specificsRoot" key={"spec"+i}>
                                            <div className = "row">
                                              <div className = "col-md-12" id="specificHeading">
                                                  {currLabel}
                                              </div>
                                              <div className = "col-md-12" id = "chart">
                                                <LineChart data={lineData} width = {(window.innerWidth/100)*47} height = {(window.innerHeight/100)*40}/>
                                              </div>
                                              <div id = "graphLabel" className = "col-md-12">
                                                {currValue}
                                              </div>
                                            </div>
                                          </div>);
                      i++;
                    }
                  }
                );
              }
            );
          }
        );
        var prefixTwo = "";
        var prefixThree = "";
        var prefixFour = "";
        var prefixOne = "";

        if (topElements.one.Value>0){
          prefixOne = "+";
        }
        if (topElements.two.Value>0){
          prefixTwo = "+";
        }
        if (topElements.three.Value>0){
          prefixThree = "+";
        }
        if (topElements.four.Value>0){
          prefixFour = "+";
        }
        var mainBrief = <div className = "col-md-12"id ="briefsRoot" key = "mainImpact">
                          <div  id = "impactType" className= "row">
                            Perctantile impact
                          </div>
                          <div className = "row">
                            <div className ="col-md-6">
                              <SunburstChart data={combinedChange.pieGraph} width = {(window.innerWidth/100)*50} height = {(window.innerHeight/100)*40}/>
                            </div>
                            <div className = "col-md-6">
                              <div className = "row">
                                <div id = "percentageDisp" className = "col-md-6">
                                  <div id = "percentage" className = "row">{prefixOne + topElements.one.Value*100+'%'}</div>
                                  <div id = "identifier" className = "row">{topElements.one.Name}</div>
                                </div>
                                <div id = "percentageDisp" className = "col-md-6">
                                  <div id = "percentage" className = "row">{prefixTwo + topElements.two.Value*100+'%'}</div>
                                  <div id = "identifier" className = "row">{topElements.two.Name}</div>
                                </div>
                              </div>
                              <div className = "row">
                                <div id = "percentageDisp" className = "col-md-6">
                                  <div id = "percentage" className = "row">{prefixThree + topElements.three.Value*100+'%'}</div>
                                  <div id = "identifier" className = "row">{topElements.three.Name}</div>
                                </div>
                                <div id = "percentageDisp" className = "col-md-6">
                                  <div id = "percentage" className = "row">{prefixFour + topElements.four.Value*100+'%'}</div>
                                  <div id = "identifier" className = "row">{topElements.four.Name}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>;
        return (<div className = "row">
                  <div id = "mainImpactTitle" className = "col-md-12">
                    {this.props.title}
                  </div>
                  <div className = "col-md-12">
                    <div id = "impactOptions" className = "row">
                      <div className="col-md-3 col-md-offset-4">
                        Start Date:
                        <DatePicker
                          dateFormat="YYYY-MM-DD"
                          selected = {this.state.momentStart}
                          onChange = {this.handleStartDateChange}
                          />
                      </div>
                      <div className="col-md-3">
                        End Date:
                        <DatePicker
                          dateFormat="YYYY-MM-DD"
                          selected = {this.state.momentEnd}
                          onChange = {this.handleEndDateChange}
                          />
                      </div>
                    </div>
                  </div>

                  <div className = "col-md-12">
                    <ResponsiveReactGridLayout
                      className="layout"
                      layouts={layouts}
                      rowHeight={window.innerHeight-((window.innerHeight/100)*3)}
                      breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                      cols={{lg: 12, md: 12, sm: 12, xs: 6, xxs: 6}}
                      measureBeforeMount={false}
                      onBreakpointChange={this.onBreakpointChange}
                      onLayoutChange={this.layoutChange}>
                      {mainBrief}
                      {specificGraphs}
                    </ResponsiveReactGridLayout>
                  </div>
                </div>)
      } else {
        return (<div>Loading..</div>)
      }

    }
}

export default Impact;

// <h2 onClick={()=>{this.props.changeSelectedStates(["NSW"])}}> NSW </h2>
// <h2 onClick={()=>{this.props.changeSelectedStates(["VIC"])}}> VIC </h2>
