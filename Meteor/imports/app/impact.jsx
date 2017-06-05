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
import SunburstChart from '/imports/app/sunburstGraph.jsx';
var PolarChart = require("react-chartjs").PolarArea;
var LineChart = require("react-chartjs").Line;

class Impact extends React.Component {

    constructor(props){
      super(props);
      //define the state of object based of paramaters
      this.state = {
        layout: [
         {i: 'mainImpact', x: 0, y: 0, w: 12, h: 0.8, isResizable:false},
         {i:'mainComparison', x:0, y:1, w:12,h:0.8, isResizable:false},
         {i:'companyImpact', x:0, y:1, w:12,h:0.7, isResizable:false},
         {i:'retailList', x:0, y:2, w:6,h:0.5, isResizable:false},
         {i:'merchList', x:6, y:2, w:6,h:0.9, isResizable:false},
         {i: 'spec0', x: 0, y: 1, w: 6, h: 0.7, isResizable:false},
         {i: 'spec1', x: 0, y: 1, w: 6, h: 0.7, isResizable:false},
         {i: 'spec2', x: 6, y: 1, w: 6, h: 0.7, isResizable:false},
         {i: 'spec3', x: 6, y: 1, w: 6, h: 0.7, isResizable:false},
        ],
        areas:["Retail","MerchandiseExports"],
        impactBrief:null,
        totalRetailMonthlyData:null,
        timePeriodStart:this.props.startDate,
        timePeriodEnd:this.props.endDate,
        region:this.props.region
      }

      //function bindings
      this.onBreakpointChange = this.onBreakpointChange.bind(this);
      this.layoutChange = this.layoutChange.bind(this);
      this.formatResponse = this.formatResponse.bind(this);
      this.findPercentGrowth = this.findPercentGrowth.bind(this);
      this.loadData = this.loadData.bind(this);
      this.handleStartDateChange = this.handleStartDateChange.bind(this);
      this.handleEndDateChange = this.handleEndDateChange.bind(this);
      this.formatSunburst = this.formatSunburst.bind(this);
      this.selectChange = this.selectChange.bind(this);
    };

    loadData(){ //loads all nessaary data into the state of the component
      var self = this;
      Meteor.call('getRetailTurnover',this.state.region,"Total,Food,Householdgood,ClothingFootwareAndPersonalAccessory,DepartmentStores,CafesResturantsAndTakeawayFood,Other",this.state.timePeriodStart,this.state.timePeriodEnd,function(err,res){
        var formatted = self.formatResponse(res,"RetailTurnover");
        self.setState({totalRetailMonthlyData:res,totalRetailMonthlyDataFormatted:formatted});
      });

      Meteor.call('getMerchandiseExports',this.state.region,"Total,FoodAndLiveAnimals,BeveragesAndTobacco,CrudMaterialAndInedible,MineralFuelLubricentAndRelatedMaterial,AnimalAndVegitableOilFatAndWaxes,ChemicalsAndRelatedProducts,ManufacutedGoods,MachineryAndTransportEquipments,OtherManucacturedArticles,Unclassified",this.state.timePeriodStart,this.state.timePeriodEnd,function(err,res){
        var formatted = self.formatResponse(res,"MerchandiseExports");
        self.setState({totalMerchMonthlyData:res,totalMerchMonthlyDataFormatted:formatted});
      });

      //splits and modifies dates to find previous cycle
      var oldStartDate = this.state.timePeriodStart.split('-');
      oldStartDate[0]=oldStartDate[0]-1;
      var oldEndDate = this.state.timePeriodEnd.split('-');
      oldEndDate[0]=oldEndDate[0]-1;
      formattedOldStartDate = oldStartDate.join("-");
      formattedOldEndDate = oldEndDate.join("-");

      //finds and formatsfringe dates
      var oldFringeDates = oldStartDate;
      oldFringeDates[1] = oldFringeDates[1]-3;
      if (oldFringeDates[1]<=0){
        oldFringeDates[0]= oldFringeDates[0]-1;
        oldFringeDates[1]= 12 + oldFringeDates[1];
      }
      formattedOldLowerFringeDate = oldFringeDates.join("-");

      var oldUpperFringeDates = oldEndDate;
      oldUpperFringeDates[1] = parseInt(oldUpperFringeDates[1])+3;
      if (oldUpperFringeDates[1]>12){
        oldUpperFringeDates[0]= parseInt(oldUpperFringeDates[0])+1;
        oldUpperFringeDates[1]= oldUpperFringeDates[1]-12;
      }
      if (oldUpperFringeDates[1] < 10 ){
        oldUpperFringeDates[1] = "0"+oldUpperFringeDates[1];
      }
      formattedOldUpperFringeDate = oldUpperFringeDates.join("-");


      var newLowerFringeDates = this.state.timePeriodStart.split('-');
      newLowerFringeDates[1] = newLowerFringeDates[1]-3;
      if (newLowerFringeDates[1]<=0){
        newLowerFringeDates[0]= newLowerFringeDates[0]-1;
        newLowerFringeDates[1]= 12 + newLowerFringeDates[1];
      }
      formattedNewLowerFringeDate = newLowerFringeDates.join("-");

      var newUpperFringeDates = this.state.timePeriodEnd.split('-');
      newUpperFringeDates[1] = parseInt(newUpperFringeDates[1])+3;
      if (newUpperFringeDates[1]>12){
        newUpperFringeDates[0]= parseInt(newUpperFringeDates[0])+1;
        newUpperFringeDates[1]= newUpperFringeDates[1]-12;
      }
      if (newUpperFringeDates[1] < 10 ){
        newUpperFringeDates[1] = "0"+newUpperFringeDates[1];
      }
      formattedNewUpperFringeDate = newUpperFringeDates.join("-");

      Meteor.call('getRetailTurnover',this.state.region,"Total,Food,Householdgood,ClothingFootwareAndPersonalAccessory,DepartmentStores,CafesResturantsAndTakeawayFood,Other",formattedOldStartDate,formattedOldEndDate,function(err,res){
        var formatted = self.formatResponse(res,"RetailTurnover");
        self.setState({totalOldRetailMonthlyData:res,totalOldRetailMonthlyDataFormatted:formatted});
      });

      Meteor.call('getMerchandiseExports',this.state.region,"Total,FoodAndLiveAnimals,BeveragesAndTobacco,CrudMaterialAndInedible,MineralFuelLubricentAndRelatedMaterial,AnimalAndVegitableOilFatAndWaxes,ChemicalsAndRelatedProducts,ManufacutedGoods,MachineryAndTransportEquipments,OtherManucacturedArticles,Unclassified",formattedOldStartDate,formattedOldEndDate,function(err,res){
        var formatted = self.formatResponse(res,"MerchandiseExports");
        self.setState({totalOldMerchMonthlyData:res,totalOldMerchMonthlyDataFormatted:formatted});
      });

      //make fringe calls

      Meteor.call('getRetailTurnover',this.state.region,"Total,Food,Householdgood,ClothingFootwareAndPersonalAccessory,DepartmentStores,CafesResturantsAndTakeawayFood,Other",formattedOldLowerFringeDate,formattedOldUpperFringeDate,function(err,res){
        var formatted = self.formatResponse(res,"RetailTurnover","fringe");
        self.setState({oldFringeRetail:res,oldFringeRetailFormatted:formatted});
      });

      Meteor.call('getRetailTurnover',this.state.region,"Total,Food,Householdgood,ClothingFootwareAndPersonalAccessory,DepartmentStores,CafesResturantsAndTakeawayFood,Other",formattedNewLowerFringeDate,formattedNewUpperFringeDate,function(err,res){
        var formatted = self.formatResponse(res,"RetailTurnover","fringe");
        self.setState({newFringeRetail:res,newFringeRetailFormatted:formatted});
      });

      Meteor.call('getMerchandiseExports',this.state.region,"Total,FoodAndLiveAnimals,BeveragesAndTobacco,CrudMaterialAndInedible,MineralFuelLubricentAndRelatedMaterial,AnimalAndVegitableOilFatAndWaxes,ChemicalsAndRelatedProducts,ManufacutedGoods,MachineryAndTransportEquipments,OtherManucacturedArticles,Unclassified",formattedOldLowerFringeDate,formattedOldUpperFringeDate,function(err,res){
        var formatted = self.formatResponse(res,"MerchandiseExports","fringe");
        self.setState({oldFringeMerch:res,oldFringeMerchFormatted:formatted});
      });

      Meteor.call('getMerchandiseExports',this.state.region,"Total,FoodAndLiveAnimals,BeveragesAndTobacco,CrudMaterialAndInedible,MineralFuelLubricentAndRelatedMaterial,AnimalAndVegitableOilFatAndWaxes,ChemicalsAndRelatedProducts,ManufacutedGoods,MachineryAndTransportEquipments,OtherManucacturedArticles,Unclassified",formattedNewLowerFringeDate,formattedNewUpperFringeDate,function(err,res){
        var formatted = self.formatResponse(res,"MerchandiseExports","fringe");
        self.setState({newFringeMerch:res,newFringeMerchFormatted:formatted});

      });

      Meteor.call('getLeadUpNews',formattedOldLowerFringeDate,formattedNewUpperFringeDate, function(err,res){
        self.setState({newsArticles:res});
      })

    }

    componentWillMount(){ //when page is loaded
      var startDateSplit = this.state.timePeriodStart.split('-');
      var endDateSplit = this.state.timePeriodEnd.split('-');
      var newStartMoment = new Moment(new Date(startDateSplit[0],startDateSplit[1]-1,startDateSplit[2])); //set existing dates
      var newEndMoment = new Moment(new Date(endDateSplit[0],endDateSplit[1]-1,endDateSplit[2]));
      this.setState({momentStart:newStartMoment,momentEnd:newEndMoment});
      this.loadData(); //load data, takes in paramaters from the state
    };

    selectChange(val){ //called when the select is changed for the state
      this.setState({region:val.value});
      FlowRouter.go('/impact?title=Custom&startDate='+this.state.timePeriodStart+'&endDate='+this.state.timePeriodEnd+'&region='+val.value);
      location.reload();
    }

    handleStartDateChange(date){ //called with date when the start date is changed through any method
      this.setState({totalMerchMonthlyData:null,totalOldMerchMonthlyData:null,totalRetailMonthlyData:null,totalOldRetailMonthlyData:null});
      this.setState({momentStart:date});
      this.setState({timePeriodStart:date.format('YYYY-MM-DD')});
      FlowRouter.go('/impact?title=Custom&startDate='+date.format('YYYY-MM-DD')+'&endDate='+this.state.timePeriodEnd+'&region='+this.state.region);
      location.reload(); //force a reload of the page due to D3
    }

    handleEndDateChange(date){ //called with date when the end date is changed through any method
      this.setState({momentEnd:date})
      this.setState({timePeriodEnd:date.format('YYYY-MM-DD')});
      this.setState({totalMerchMonthlyData:null,totalOldMerchMonthlyData:null,totalRetailMonthlyData:null,totalOldRetailMonthlyData:null});
      FlowRouter.go('/impact?title=Custom&startDate='+this.state.timePeriodStart+'&endDate='+date.format('YYYY-MM-DD')+'&region='+this.state.region);
      location.reload(); //force a reoload of page due to D3 rendering
    }

    formatSunburst(combinedPercents){ //take in the calculated percentages and return it formatted for the sunburst chart
      var base = {
        "name": "flare",
        "children": []};
      var i = 0;
      Object.entries(combinedPercents).forEach(([key,value]) => {
        var topLevel = key;
        base.children.push({"name":key,"children":[]});
        Object.entries(value).forEach(([key,value]) =>{
          base.children[i].children.push({"name":key,"size":value})
        })
        i++;
      });
      return(base);
    }

    formatResponse(data,industry,labelType) { //take the data recieved by our API and format it into several different data types at the same time to reduce computation
      var lineArray = new Array(); //create the arrays we will fill with data set values
      var labelArray = new Array();
      var pieArray = new Array();
      var table = new Array();
      var totals = {};
      table.push(<tr><th>Sub-category</th><th>Total</th></tr>);
      for (i=0;i< data.length;i++){ //for each piece of data
        var curr = data[i];
        var dataSet= {
          label: curr[transforms[industry].topLevelCategory],//different areas have different JSON values, so we use the transforms array to convert an industry name into its applicable category name
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
        for (j=0;j< currMonthData.length;j++){ //for each month in the current data set
          //if the data is not present for that month
          if (currMonthData[j][transforms[industry].dataValue] == "Data missing" || currMonthData[j][transforms[industry].dataValue] == null){
            continue; //skip and do not add
          }
          dataSet.data.push(currMonthData[j][transforms[industry].dataValue].toFixed(2)); //add data to root line chart data set
          total = total +currMonthData[j][transforms[industry].dataValue]; //add to total
          if (i==0){
            labelArray.push(currMonthData[j].Date.slice(5,-3)); //add date to the list of labels for any graph that uses this data
          }
        }
        pieDataSet.value =total.toFixed(2); //add data to pie chart
        if (labelType == "fringe"){ //if we are calling this to format fringe data we need a different kind of label array
          if (i==0) this.setState({fringeGraphLabels:labelArray});
        } else {
          if (i==0) this.setState({lineGraphLabels:labelArray});
        }
        if (curr[transforms[industry].topLevelCategory].match(/^total/gi)){ //ignore the total section as it is irrelevant to us
          lineArray.push(dataSet);
          continue;
        }
        totals[curr[transforms[industry].topLevelCategory]]=total.toFixed(2);
        pieArray.push(pieDataSet);
        lineArray.push(dataSet); //push all datasets
        table.push(<tr><td>{curr[transforms[industry].topLevelCategory]}</td> <td>{total.toFixed(2)}</td></tr>);
      }
      var completedTable = <table id ="singularDataTable">{table}</table>;
      return {lineGraph:lineArray,pieGraph:pieArray,tableData:completedTable,totalsData:totals}; //return values
    }

    onBreakpointChange(breakpoint){ //for debug purposes
      // console.log(breakpoint)
    }

    layoutChange(layout){ //for debug purposes
      // console.log(layout);
    }

    findPercentGrowth(oldArray,newArray){ //find the percentatge growth between object arrays
      //pass in
      var pieGraphData = new Array();
      var totalsPercents = {}
      var i=0;
      Object.entries(oldArray).forEach(
        ([key,value]) => {
          var percentageGrowth = 1-(oldArray[key]/newArray[key]);
          percentageGrowth = percentageGrowth.toFixed(2);
          var label = key
          var colour = "rgba(0,300,"+(i+1*50)+",";
          if (percentageGrowth< 0){
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
      var layouts = {lg:this.state.layout,md:this.state.layout}; //set the layout

      //If we have loaded the data
      if (this.state.totalMerchMonthlyData && this.state.totalRetailMonthlyData && this.state.totalOldRetailMonthlyData && this.state.totalOldMerchMonthlyData && this.state.newFringeRetail && this.state.oldFringeRetail && this.state.oldFringeMerch && this.state.newFringeMerch && this.state.newsArticles){
        //calculate percentage growths and find their change
        var retailChange = this.findPercentGrowth(this.state.totalOldRetailMonthlyDataFormatted.totalsData,this.state.totalRetailMonthlyDataFormatted.totalsData);
        var merchChange = this.findPercentGrowth(this.state.totalOldMerchMonthlyDataFormatted.totalsData,this.state.totalMerchMonthlyDataFormatted.totalsData);
        var combinedChange = {pieGraph:retailChange.pieGraph.concat(merchChange.pieGraph)};

        //format the found growths and change
        var totalOldDataFormatted = {RetailTurnover:this.state.totalOldRetailMonthlyDataFormatted.lineGraph,MerchandiseExports:this.state.totalOldMerchMonthlyDataFormatted.lineGraph};
        var totalNewDataFormatted = {RetailTurnover:this.state.totalRetailMonthlyDataFormatted.lineGraph,MerchandiseExports:this.state.totalMerchMonthlyDataFormatted.lineGraph};
        var combinedPercents = {RetailTurnover:retailChange.percents,MerchandiseExports:merchChange.percents};
        var flareData = this.formatSunburst(combinedPercents);
        //find the important values
        var topElements ={one:{Name:null,Value:null},two:{Name:null,Value:null},three:{Name:null,Value:null},four:{Name:null,Value:null}};
        Object.entries(combinedPercents).forEach(
          ([key1,value1]) => {
            Object.entries(combinedPercents[key1]).forEach(
              ([key2,value2]) => {
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
        //set the labels, converting them into months
        normlabels = this.state.lineGraphLabels;
        fringeLabels = this.state.fringeGraphLabels;

        for(iJ=0;iJ< normlabels.length;iJ++){
          curr = normlabels[iJ];
          if (curr == "01") normlabels[iJ] = "Jan";
          if (curr == "02") normlabels[iJ] = "Feb";
          if (curr == "03") normlabels[iJ] = "Mar";
          if (curr == "04") normlabels[iJ] = "Apr";
          if (curr == "05") normlabels[iJ] = "May";
          if (curr == "06") normlabels[iJ] = "Jun";
          if (curr == "07") normlabels[iJ] = "Jul";
          if (curr == "08") normlabels[iJ] = "Aug";
          if (curr == "09") normlabels[iJ] = "Sep";
          if (curr == "10") normlabels[iJ] = "Oct";
          if (curr == "11") normlabels[iJ] = "Nov";
          if (curr == "12") normlabels[iJ] = "Dec";
        }

        for (iJ=0; iJ< fringeLabels.length;iJ++){
          curr = fringeLabels[iJ];
          if (curr == "01") fringeLabels[iJ] = "Jan";
          if (curr == "02") fringeLabels[iJ] = "Feb";
          if (curr == "03") fringeLabels[iJ] = "Mar";
          if (curr == "04") fringeLabels[iJ] = "Apr";
          if (curr == "05") fringeLabels[iJ] = "May";
          if (curr == "06") fringeLabels[iJ] = "Jun";
          if (curr == "07") fringeLabels[iJ] = "Jul";
          if (curr == "08") fringeLabels[iJ] = "Aug";
          if (curr == "09") fringeLabels[iJ] = "Sep";
          if (curr == "10") fringeLabels[iJ] = "Oct";
          if (curr == "11") fringeLabels[iJ] = "Nov";
          if (curr == "12") fringeLabels[iJ] = "Dec";
        }

        //now for each of the top elements we need to get their line graph data
        var specificGraphs = new Array();
        var allGraphs = new Array();
        var i=0;
        var jLO=0;

        //if it wasn't for D3, this would be in a component yet doing so causes a state update
        Object.entries(topElements).forEach(
          ([key1,value1]) => {
            //get line graph data,push to total elements pool
            Object.entries(totalOldDataFormatted).forEach(
              ([key2,value2]) => {
                Object.entries(totalOldDataFormatted[key2]).forEach(
                  ([key3,value3]) => {
                    if (value1.Name == value3.label){ //look through each formatted data till we find the appropriate one
                      var newData = new Array();
                      var toBePushed = totalNewDataFormatted[key2][key3];
                      var currLabel = toBePushed.label
                      toBePushed.label = "Previous";
                      newData.push(toBePushed);
                      var newtoBePushed = value3;
                      newtoBePushed.label="Current";
                      newData.push(newtoBePushed);
                      var lineData = {
                        labels: normlabels,
                        datasets:newData
                      }

                      //determine the value of these numbers
                      var currValue = "(Thousands of dollars)";
                      var possibleCategoryRetail = ["Total","Food","Householdgood","ClothingFootwareAndPersonalAccessory","DepartmentStores","CafesResturantsAndTakeawayFood","Other"]
                      if (possibleCategoryRetail.includes(currLabel)){
                        currValue = "(Millions of dollars)"
                      }

                      //calculate gross change values
                      var previousTotal = 0 ;
                      var nextTotal = 0;

                      for (kL=0; kL< newData[0].data.length;kL++){
                        previousTotal = previousTotal + parseInt(newData[0].data[kL]);
                      }

                      for (kL=0; kL< newData[1].data.length;kL++){
                        nextTotal = nextTotal + parseInt(newData[1].data[kL]);
                      }

                      var percentageDifference = (1-( nextTotal/ previousTotal )) *100;

                      var rounded = percentageDifference.toFixed(2);

                      //push the JSX component to the array to be rendered
                      specificGraphs.push(<div className = "col-md-6" id = "specificsRoot" key={"spec"+i}>
                                            <div className = "row">
                                              <div className = "col-md-12" id="specificHeading">
                                                  {currLabel}
                                              </div>
                                              <div id = "graphLabel" className = "col-md-12">
                                                {currValue}
                                              </div>
                                              <div className = "col-md-12" id = "subChart">
                                                <LineChart data={lineData} width = {(window.innerWidth/100)*47} height = {(window.innerHeight/100)*40}/>
                                              </div>
                                              <br></br>
                                              <div className = "col-md-6" id = "bottomRatioTitle">
                                                <div className = "row" id= "ratioNumber">{rounded}%</div>
                                                <div id="subLabel"> Percentage change in this sector</div>
                                              </div>
                                              <div className = "col-md-6" id = "bottomRatioTitle">
                                                <div className = "row" id= "ratioNumber">${nextTotal-previousTotal}</div>
                                                <div id="subLabel"> Gross change</div>
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

        //timeline component section
        //create fringe data and move actual data to the center of the timeline
        var totalDataFringed = new Array();
        var tempOldRetailSave = totalOldDataFormatted.RetailTurnover[6];
        var tempNewRetailSave = totalNewDataFormatted.RetailTurnover[6];
        tempOldRetailSave.data.unshift(null); //offset data
        tempOldRetailSave.data.unshift(null);
        tempOldRetailSave.data.unshift(null);
        tempNewRetailSave.data.unshift(null);
        tempNewRetailSave.data.unshift(null);
        tempNewRetailSave.data.unshift(null);

        //create fringe data and their syles
        var tempOldRetailFringe = this.state.oldFringeRetailFormatted.lineGraph[6];
        tempOldRetailFringe.fillColor = "rgba(50,50,50,0.2)"
        tempOldRetailFringe.pointColor = "rgba(50,50,50,1)"
        tempOldRetailFringe.strokeColor = "rgba(50,50,50,1)"

        var tempNewRetailFringe = this.state.newFringeRetailFormatted.lineGraph[6];
        tempNewRetailFringe.fillColor = "rgba(50,50,50,0.2)"
        tempNewRetailFringe.pointColor = "rgba(50,50,50,1)"
        tempNewRetailFringe.strokeColor = "rgba(50,50,50,1)"

        totalDataFringed.push(tempOldRetailFringe);
        totalDataFringed.push(tempNewRetailFringe);
        totalDataFringed.push(tempOldRetailSave);
        totalDataFringed.push(tempNewRetailSave);

        //do the same for MerchandiseExports
        var totalMerchDataFringed = new Array();
        var tempOldMerchSave = totalOldDataFormatted.MerchandiseExports[0];
        var tempNewMerchSave = totalNewDataFormatted.MerchandiseExports[0];
        tempOldMerchSave.data.unshift(null); //offset data
        tempOldMerchSave.data.unshift(null);
        tempOldMerchSave.data.unshift(null);
        tempNewMerchSave.data.unshift(null);
        tempNewMerchSave.data.unshift(null);
        tempNewMerchSave.data.unshift(null);

        var tempOldMerchFringe = this.state.oldFringeMerchFormatted.lineGraph[0];
        tempOldMerchFringe.fillColor = "rgba(50,50,50,0.2)"
        tempOldMerchFringe.pointColor = "rgba(50,50,50,1)"
        tempOldMerchFringe.strokeColor = "rgba(50,50,50,1)"

        var tempNewMerchFringe = this.state.newFringeMerchFormatted.lineGraph[0];
        tempNewMerchFringe.fillColor = "rgba(50,50,50,0.2)"
        tempNewMerchFringe.pointColor = "rgba(50,50,50,1)"
        tempNewMerchFringe.strokeColor = "rgba(50,50,50,1)"

        totalMerchDataFringed.push(tempOldMerchSave);
        totalMerchDataFringed.push(tempNewMerchSave);
        totalMerchDataFringed.push(tempOldMerchFringe);
        totalMerchDataFringed.push(tempNewMerchFringe);


        //add the labels and create a the line data objects to be interpretted
        var fringeLineData = {
          labels: this.state.fringeGraphLabels,
          datasets:totalDataFringed
        }

        var merchFringLineData = {
          labels: this.state.fringeGraphLabels,
          datasets:totalMerchDataFringed
        }
        //return component to be rendered
        var mainComparisonGraph = <div className = "col-md-12" id = "specificsRoot" key="mainComparison">
                                    <div className = "row">
                                      <div className = "col-md-12" id="specificHeading">
                                          Timeline
                                      </div>
                                      <div className = "col-md-6" id = "chart">
                                        <div id = "timelineTitle" className = "row">
                                          Retail and Trade
                                        </div>
                                        <div className = "row">
                                          <LineChart data={fringeLineData} width = {(window.innerWidth/100)*47} height = {(window.innerHeight/100)*60}/>
                                        </div>
                                      </div>
                                      <div className = "col-md-6" id = "chart">
                                        <div id = "timelineTitle" className = "row">
                                          Merchandise Exports
                                        </div>
                                        <div className = "row">
                                          <LineChart data={merchFringLineData} width = {(window.innerWidth/100)*47} height = {(window.innerHeight/100)*60}/>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

        //generate complete tables

        var retailTablePercents = new Array();
        var merchTablePercents = new Array();

        Object.entries(combinedPercents.RetailTurnover).forEach(([key,value])=>{
          retailTablePercents.push(<tr><td>{key}</td> <td>{(value*100).toFixed(2)}%</td><td onClick={()=>{specificGraphs}}> Add Panel</td></tr>)
        })

        Object.entries(combinedPercents.MerchandiseExports).forEach(([key,value])=>{
          merchTablePercents.push(<tr><td>{key}</td> <td>{(value*100).toFixed(2)}%</td><td onClick={()=>{specificGraphs}}> Add Panel</td></tr>)
        })

        //create list for retail
        var mainList =<div className = "col-md-6" id = "specificsRoot" key="retailList">
                              <div className = "row">
                                <div className = "col-md-12" id="specificHeading">
                                    Complete Retail Impact
                                </div>
                                <div className = "col-md-12" id = "tableCenter">
                                  <tr><th>Category</th><th>Percent change</th><th></th></tr>
                                  {retailTablePercents}
                                </div>
                              </div>
                            </div>;

        //create list for merch
        var merchList =<div className = "col-md-6" id = "specificsRoot" key="merchList">
                              <div className = "row">
                                <div className = "col-md-12" id="specificHeading">
                                    Complete Merchandise Impact
                                </div>
                                <div className = "col-md-12" id = "tableCenter">
                                  <tr><th>Category</th><th>Percent change</th><th></th></tr>
                                  {merchTablePercents}
                                </div>
                              </div>
                            </div>;

        //create top main brief section component

        //generate prefix's
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

        //generate main component

        var mainBrief = <div className = "col-md-12"id ="briefsRoot" key = "mainImpact">
                          <div  id = "specificHeading" className= "row">
                            Disaster Impact
                          </div>
                          <div className = "row">
                            <div id = "d3Padder" className ="col-md-6">
                              <SunburstChart data={this.formatSunburst(combinedPercents)}/>
                            </div>
                            <div id = "impactedIndustries" className = "col-md-6">
                              <div >
                              <div className = "row">
                                <div  className= "row">
                                  <div id = "impactedIndustriesTitle">
                                    Keys Statistics
                                  </div>
                                </div>
                                <div id = "percentageDisp" className = "col-md-6">
                                  <div id = "percentage" className = "row">{prefixOne + (topElements.one.Value*100).toFixed(0)+'%'}</div>
                                  <div id = "identifier" className = "row">{topElements.one.Name}</div>
                                </div>
                                <div id = "percentageDisp" className = "col-md-6">
                                  <div id = "percentage" className = "row">{prefixTwo + (topElements.two.Value*100).toFixed(0)+'%'}</div>
                                  <div id = "identifier" className = "row">{topElements.two.Name}</div>
                                </div>
                              </div>
                              <div className = "row">
                                <div id = "percentageDisp" className = "col-md-6">
                                  <div id = "percentage" className = "row">{prefixThree + (topElements.three.Value*100).toFixed(0)+'%'}</div>
                                  <div id = "identifier" className = "row">{topElements.three.Name}</div>
                                </div>
                                <div id = "percentageDisp" className = "col-md-6">
                                  <div id = "percentage" className = "row">{prefixFour + (topElements.four.Value*100).toFixed(0)+'%'}</div>
                                  <div id = "identifier" className = "row">{topElements.four.Name}</div>
                                </div>
                              </div>
                              </div>
                            </div>
                          </div>
                        </div>;


        //company links array generated from CSV
        //contains the stocks affected by each industry and the magnitude to which they are impacted
        const companyLinks = {
          "Food retailing":[{stockCode:"T3D",stockName:"333D LIMITED",stockImpact:0.9},
                  {stockCode:"ABT",stockName:"ABUNDANT PRODUCE LIMITED",stockImpact:0.9},
                  {stockCode:"AAC",stockName:"AUSTRALIAN AGRICULTURAL COMPANY LIMITED.",stockImpact:0.9},
                  {stockCode:"AAP",stockName:"AUSTRALIAN AGRICULTURAL PROJECTS LIMITED",stockImpact:0.9},
                  {stockCode:"AHF",stockName:"AUSTRALIAN DAIRY FARMS GROUP",stockImpact:0.9},
                  {stockCode:"AVG",stockName:"AUSTRALIAN VINTAGE LTD",stockImpact:0.9},
                  {stockCode:"AWY",stockName:"AUSTRALIAN WHISKY HOLDINGS LIMITED",stockImpact:0.9},
                  {stockCode:"BGA",stockName:"BEGA CHEESE LIMITED",stockImpact:0.9},
                  {stockCode:"BAL",stockName:"BELLAMY'S AUSTRALIA LIMITED",stockImpact:0.9},
                  {stockCode:"BFC",stockName:"BESTON GLOBAL FOOD COMPANY LIMITED",stockImpact:0.9},
                  {stockCode:"BEE",stockName:"BROO LTD",stockImpact:0.9},
                  {stockCode:"BUB",stockName:"BUBS AUSTRALIA LIMITED",stockImpact:0.9},
                  {stockCode:"BUG",stockName:"BUDERIM GROUP LIMITED",stockImpact:0.9},
                  {stockCode:"CZZ",stockName:"CAPILANO HONEY LIMITED",stockImpact:0.9}],
          "Household goods retailing":[{stockCode:"AHY",stockName:"ASALEO CARE LIMITED",stockImpact:0.9},
                  {stockCode:"BKL",stockName:"BLACKMORES LIMITED",stockImpact:0.9},
                  {stockCode:"BWX",stockName:"BWX LIMITED",stockImpact:0.9},
                  {stockCode:"HCT",stockName:"HOLISTA COLLTECH LIMITED",stockImpact:0.9},
                  {stockCode:"MHI",stockName:"MERCHANT HOUSE INTERNATIONAL LIMITED",stockImpact:0.9},
                  {stockCode:"PTL",stockName:"PENTAL LIMITED",stockImpact:0.9},
                  {stockCode:"SKN",stockName:"SKIN ELEMENTS LIMITED",stockImpact:0.9},
                  {stockCode:"TIL",stockName:"TRILOGY INTERNATIONAL LIMITED",stockImpact:0.9}],
          "Clothing, footwear and personal accessory retailing":[{stockCode:"NNW",stockName:"99 WUXIAN LIMITED",stockImpact:0.4},
                  {stockCode:"ADH",stockName:"ADAIRS LIMITED",stockImpact:0.4},
                  {stockCode:"AMA",stockName:"AMA GROUP LIMITED",stockImpact:0.4},
                  {stockCode:"APE",stockName:"AP EAGERS LIMITED",stockImpact:0.4},
                  {stockCode:"AHG",stockName:"AUTOMOTIVE HOLDINGS GROUP LIMITED.",stockImpact:0.4},
                  {stockCode:"BBN",stockName:"BABY BUNTING GROUP LIMITED",stockImpact:0.4},
                  {stockCode:"BAP",stockName:"BAPCOR LIMITED",stockImpact:0.4},
                  {stockCode:"BDA",stockName:"BOD AUSTRALIA LIMITED",stockImpact:0.4}],
          "Department stores":[{stockCode:"BLX",stockName:"BEACON LIGHTING GROUP LIMITED",stockImpact:0.7},
                  {stockCode:"BRG",stockName:"BREVILLE GROUP LIMITED",stockImpact:0.7},
                  {stockCode:"CCV",stockName:"CASH CONVERTERS INTERNATIONAL",stockImpact:0.7},
                  {stockCode:"CQR",stockName:"CHARTER HALL RETAIL REIT",stockImpact:0.7},
                  {stockCode:"DLC",stockName:"DELECTA LIMITED",stockImpact:0.7},
                  {stockCode:"FUN",stockName:"FUNTASTIC LIMITED",stockImpact:0.7},
                  {stockCode:"GFY",stockName:"GODFREYS GROUP LIMITED",stockImpact:0.7},
                  {stockCode:"HT8",stockName:"HARRIS TECHNOLOGY GROUP LIMITED",stockImpact:0.7}],
          "Cafes, restaurants and takeaway food services":[{stockCode:"RFG",stockName:"RETAIL FOOD GROUP LIMITED", stockImpact:0.5},
                  {stockCode:"DMP",stockName:"DOMINO'S PIZZA ENTERPRISES LIMITED", stockImpact:0.5}],
          "Other retailing":[{stockCode:"MPL",stockName:"MEDIBANK PRIVATE LIMITED", stockImpact:0.7},
                  {stockCode:"NFH",stockName:"NIB HOLDINGS LIMITED", stockImpact:0.6}],
          "Food and live animals":[{stockCode:"PDF",stockName:"PACIFIC DAIRIES LIMITED",stockImpact:0.7},
                  {stockCode:"RGP",stockName:"REFRESH GROUP LIMITED",stockImpact:0.7},
                  {stockCode:"RFG",stockName:"RETAIL FOOD GROUP LIMITED",stockImpact:0.7},
                  {stockCode:"RIC",stockName:"RIDLEY CORPORATION LIMITED",stockImpact:0.7},
                  {stockCode:"SFG",stockName:"SEAFARMS GROUP LIMITED",stockImpact:0.7},
                  {stockCode:"SHV",stockName:"SELECT HARVESTS LIMITED",stockImpact:0.7}],
          "Beverages and tobacco":[{stockCode: "CCL",stockCode:"COCA-COLA AMATIL LIMITED",stockCode:0.6}],
          "Crude materials, inedible, except fuels":[{stockCode:"BHP",stockName:"BHP BILLITON LIMITED",stockImpact:0.9}],
          "Mineral fuels, lubricants and related materials":[{stockCode:"SXY", stockName:"SENEX ENERGY LIMITED", stockImpact:0.5},
                  {stockCode:"YAL", stockName:"YANCOAL AUSTRALIA L`IMITED", stockImpact:0.7},
                  {stockCode:"WPL", stockName:"WOODSIDE PETROLEUM LIMITED", stockImpact:0.4}],
          "Animal and vegetable oils, fats and waxes":[{stockCode:"PTL", stockName:"PENTAL LIMITED", stockImpact:0.7}],
          "Chemicals and related products, nes":[{stockCode:"ATC", stockName:"ALTECH CHEMICALS LTD", stockImpact:0.5},
                  {stockCode:"IPL", stockName:"INCITEC PIVOT LIMITED", stockImpact:0.6}],
          "Manufactured goods classified chiefly by material":[{stockCode:"NUF", stockName:"NUFARM LIMITED", stockImpact:0.5},
                  {stockCode:"PGH", stockName:"PACT GROUP HOLDINGS LTD", stockImpact:0.6},
                  {stockCode:"JYC", stockName:"JOYCE CORPORATION LTD", stockImpact:0.8}],
          "Machinery and transport equipment":[{stockCode:"DOW", stockName:"DOWNER EDI LIMITED", stockImpact:0.6}],
          "Miscellaneous manufactured articles":[]
        }

        var impactedCompanies = new Array();
        //calculate the impacted companies using the given data
        Object.entries(combinedPercents).forEach( //for each area in combined percents
          ([key1,value1]) => {
            Object.entries(combinedPercents[key1]).forEach( //iterate through each percentage of an area
              ([key2,value2]) => {
                if (Math.abs(value2)>0.05){ //if the impact percentage on this company is signficant enough
                  if (companyLinks[key2]){
                    for (jiH=0;jiH< companyLinks[key2].length;jiH++){
                      var curr = companyLinks[key2][jiH];
                      var newsForCurrent = new Array();
                      var searchingCode = curr +".AX";
                      var currentSentiment = 0;
                      for (newsCounter = 0; newsCounter< this.state.newsArticles.length;newsCounter++){ //iterate through news stories we have calculating sentiment
                        if (this.state.newsArticles[newsCounter].InstrumentIDs.includes(searchingCode)){
                          newsForCurrent.push(this.state.newsArticles[newsCounter]);
                          currentSentiment=currentSentiment + this.state.newsArticles[newsCounter].Sentiment.Polarity;
                        }
                      }

                      //determine values and images
                      var sentiment = "N/A"
                      if (currentSentiment>0){
                        sentiment= "positive"
                        if (currentSentiment>0.5){
                          sentiment = "very positive"
                        }
                      } else if (currentSentiment < 0){
                        sentiment = "negative"
                        if (currentSentiment<-0.5){
                          sentiment = "very negative"
                        }
                      }
                      var impactAmount = "negligable";
                      var actualImpact = curr.stockImpact*value2;
                      var arrowSource = "";

                      if (actualImpact>0){
                        impactAmount = "Slight Positive Impact";
                        arrowSource = "/images/singleUp.png";
                        if (actualImpact>0.1){
                          impactAmount = "Moderate Positive Impact";
                          arrowSource = "/images/singleUp.png";
                        }
                        if (actualImpact > 0.15) {
                          impactAmount = "Strong Positive Impact"
                          arrowSource = "/images/Double_arrow_green_up.png"
                        }
                      } else if (actualImpact< 0){
                        impactAmount = "Slight Negative Impact"
                        arrowSource = "/images/singleDown.svg"
                        if (actualImpact< -0.1){
                          impactAmount = "Moderate Negative Impact"
                          arrowSource = "/images/singleDown.svg"
                        }
                        if (actualImpact < -0.15) {
                          impactAmount = "Strong Negative Impact"
                          arrowSource = "/images/Double_arrow_red_down.png"
                        }
                      }
                      if (impactAmount=="Slight Negative Impact" || impactAmount == "Slight Positive Impact"){
                        continue;
                      }
                      //push stock to company impact statement
                      impactedCompanies.push(<div className = "col-md-3" id = "stockElement">
                        <div className = "row" id = "stockCode">
                          {curr.stockCode}
                          <img id = "stockArrow" src = {arrowSource}></img>
                        </div>
                        <div className = "row" id = "stockName">
                          {curr.stockName}
                        </div>
                        <div className = "row" id = "stockImpact">
                          {impactAmount}
                        </div>
                        <div className = "row" id = "stockSentiment">
                          Sentiment:{sentiment}
                        </div>
                      </div>)
                    }
                  }


                }
              }
            );
          }
        );
        //create root company impact element
        var companyImpact = <div className = "col-md-12" key="companyImpact">
                    <div  id = "specificHeading" className= "row">
                      Company impact
                    </div>
                    <div className = "row">
                      {impactedCompanies}
                    </div>
                </div>

        //return the collection of elements
        return (<div className = "row">
                  <div id = "mainImpactTitle" className = "col-md-12">
                    {this.props.title}
                  </div>
                  <div className = "col-md-12">
                    <div id = "impactOptions" className = "row">
                      <div className="col-md-3 col-md-offset-2">
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
                      <div className ="col-md-3">
                        <div className = "row">
                          <div className = "col-md-2" id = "regionAdder">
                            Region:
                          </div>
                          <div className = "col-md-9 col-md-offset-1">
                            <Select
                              name= "state-selector"
                              value= {this.state.region}
                              options = {[{value:"AUS",label:"AUS"},{value:"NSW",label:"NSW"},{value:"VIC",label:"VIC"},{value:"NT",label:"NT"},{value:"WA",label:"WA"},{value:"SA",label:"SA"},
                              {value:"ACT",label:"ACT"},{value:"TAS",label:"TAS"},{value:"QLD",label:"QLD"}]}
                              clearable = {false}
                              onChange = {this.selectChange}
                              className = "selectRegion"
                            />
                          </div>
                        </div>


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
                      {mainComparisonGraph}
                      {companyImpact}
                      {specificGraphs}
                      {mainList}
                      {merchList}
                    </ResponsiveReactGridLayout>
                  </div>
                </div>)
      } else {
        return (<div>Loading..</div>) //we are still loading data
      }

    }
}

export default Impact;
