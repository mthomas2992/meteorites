import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

var transforms = {RetailTurnover:{topLevelCategory:"RetailIndustry",dataValue:"Turnover"},MerchandiseExports:{topLevelCategory:"Commodity",dataValue:"Value"}};
var colours=["rgba(150,0,0,","rgba(0,150,0,","rgba(0,0,150,","rgba(250,200,150,","rgba(150,200,250,",
            "rgba(250,0,150,","rgba(200,250,150,","rgba(220,220,220,","rgba(100,200,150,","rgba(200,150,100,"];

import ReactGridLayout from 'react-grid-layout';
require ('/node_modules/react-grid-layout/css/styles.css');
require ('/node_modules/react-resizable/css/styles.css');
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
var PolarChart = require("react-chartjs").PolarArea;


class Impact extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        layout: [
         {i: 'mainImpact', x: 0, y: 0, w: 12, h: 0.6, isResizable:false},
         {i: 'briefs1', x: 0, y: 1, w: 6, h: 1, isResizable:false},
         {i: 'briefs2', x: 0, y: 1, w: 6, h: 1, isResizable:false},
         {i: 'briefs3', x: 6, y: 1, w: 6, h: 1, isResizable:false},
        ],
        areas:["Retail","MerchandiseExports"],
        impactBrief:null,
        totalRetailMonthlyData:null
      }

      this.onBreakpointChange = this.onBreakpointChange.bind(this);
      this.layoutChange = this.layoutChange.bind(this);

      this.formatResponse = this.formatResponse.bind(this);
      this.findPercentGrowth = this.findPercentGrowth.bind(this);

    };

    componentWillMount(){
      var self = this;
      Meteor.call('getRetailTurnover',"AUS,","Total,Food,Householdgood,ClothingFootwareAndPersonalAccessory,DepartmentStores,CafesResturantsAndTakeawayFood,Other",this.props.startDate,this.props.endDate,function(err,res){
        var formatted = self.formatResponse(res,"RetailTurnover");
        self.setState({totalRetailMonthlyData:res,totalRetailMonthlyDataFormatted:formatted});
      });

      Meteor.call('getMerchandiseExports',"AUS,","Total,FoodAndLiveAnimals,BeveragesAndTobacco,CrudMaterialAndInedible,MineralFuelLubricentAndRelatedMaterial,AnimalAndVegitableOilFatAndWaxes,ChemicalsAndRelatedProducts,ManufacutedGoods,MachineryAndTransportEquipments,OtherManucacturedArticles,Unclassified",this.props.startDate,this.props.endDate,function(err,res){
        var formatted = self.formatResponse(res,"MerchandiseExports");
        self.setState({totalMerchMonthlyData:res,totalMerchMonthlyDataFormatted:formatted});
      });

      var oldStartDate = this.props.startDate.split('-');
      oldStartDate[0]=oldStartDate[0]-1;
      var oldEndDate = this.props.endDate.split('-');
      oldEndDate[0]=oldEndDate[0]-1;
      formattedOldStartDate = oldStartDate.join("-");
      formattedOldEndDate = oldEndDate.join("-");

      Meteor.call('getRetailTurnover',"AUS,","Total,Food,Householdgood,ClothingFootwareAndPersonalAccessory,DepartmentStores,CafesResturantsAndTakeawayFood,Other",formattedOldStartDate,formattedOldEndDate,function(err,res){
        var formatted = self.formatResponse(res,"RetailTurnover");
        self.setState({totalOldRetailMonthlyData:res,totalOldRetailMonthlyDataFormatted:formatted});
      });

      Meteor.call('getMerchandiseExports',"AUS,","Total,FoodAndLiveAnimals,BeveragesAndTobacco,CrudMaterialAndInedible,MineralFuelLubricentAndRelatedMaterial,AnimalAndVegitableOilFatAndWaxes,ChemicalsAndRelatedProducts,ManufacutedGoods,MachineryAndTransportEquipments,OtherManucacturedArticles,Unclassified",formattedOldStartDate,formattedOldEndDate,function(err,res){
        var formatted = self.formatResponse(res,"MerchandiseExports");
        console.log(res);
        console.log(formatted);
        self.setState({totalOldMerchMonthlyData:res,totalOldMerchMonthlyDataFormatted:formatted});
      });

    };

    formatResponse(data,industry) {
      var lineArray = new Array();
      var labelArray = new Array();
      var pieArray = new Array();
      var table = new Array();
      var totals = {};
      table.push(<tr><th>Sub-category</th><th>Total</th></tr>);
      for (i=0;i<data.length;i++){
        var curr = data[i];
        var dataSet= {
          label: curr[transforms[industry].topLevelCategory].substring(0,15) +"... ",
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
      		label: curr[transforms[industry].topLevelCategory].substring(0,15) +"... "
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
            labelArray.push(currMonthData[j].Date.slice(0,-3));
          }
        }
        pieDataSet.value =total.toFixed(2);
        if (i==0) this.setState({lineGraphLabels:labelArray});
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
      var pieGraphData = new Array();
      var totalsPercents = {}
      var i=0;
      Object.entries(oldArray).forEach(
        ([key,value]) => {
          var percentageGrowth = 1-(oldArray[key]/newArray[key]);
          percentageGrowth = percentageGrowth.toFixed(2);
          pieGraphData.push({
            value: percentageGrowth,
        		color:colours[i]+"0.5)",
        		highlight: "#FF5A5E",
        		label: key
          })
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
        var combinedChange = retailChange; //combination will occur here
        var combinedPercents = {RetailTurnover:retailChange.percents,MerchandiseExports:retailChange.percents}; //change this to merchChange when it works
        var topElements ={one:{Name:null,Value:null},two:{Name:null,Value:null},three:{Name:null,Value:null},four:{Name:null,Value:null}};
        console.log(combinedPercents);
        Object.entries(combinedPercents).forEach(
          ([key1,value1]) => {
            console.log(key1);
            Object.entries(combinedPercents[key1]).forEach(
              ([key2,value2]) => {
                if (Math.abs(value2)>topElements.one.Value){
                  topElements.one = {Name:key2, Value:value2};
                } else if (Math.abs(value2)>topElements.two.Value){
                  topElements.two = {Name:key2, Value:value2};
                } else if (Math.abs(value2)>topElements.three.Value){
                  topElements.three = {Name:key2, Value:value2};
                } else if (Math.abs(value2)>topElements.four.Value){
                  topElements.four = {Name:key2, Value:value2};
                }
              }
            )
          }
        )
        var mainBrief = <div className = "col-md-12"id ="briefsRoot" key = "mainImpact">
                          <div className = "row">
                            <div className ="col-md-6">
                              <PolarChart data={combinedChange.pieGraph} width = {(window.innerWidth/100)*50} height = {(window.innerHeight/100)*40}/>
                            </div>
                            <div className = "col-md-6">
                              <div className = "row">
                                <div id = "percentageDisp" className = "col-md-6">
                                  {topElements.one.Value*100+'%'}
                                  {topElements.one.Name}
                                </div>
                                <div id = "percentageDisp" className = "col-md-6">
                                  {topElements.two.Value*100+'%'}
                                  {topElements.two.Name}
                                </div>
                              </div>
                              <div className = "row">
                                <div id = "percentageDisp" className = "col-md-6">
                                  {topElements.three.Value*100+'%'}
                                  {topElements.three.Name}
                                </div>
                                <div id = "percentageDisp" className = "col-md-6">
                                  {topElements.four.Value*100+'%'}
                                  {topElements.four.Name}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>;
        return (<div className = "row">
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
                  </ResponsiveReactGridLayout>
                </div>)
      } else {
        return (<div>Loading..</div>)
      }

    }
}

export default Impact;

// <h2 onClick={()=>{this.props.changeSelectedStates(["NSW"])}}> NSW </h2>
// <h2 onClick={()=>{this.props.changeSelectedStates(["VIC"])}}> VIC </h2>