import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

import Sunburst from '/imports/app/sunburstGraph.jsx';

import Select from 'react-select';

var possibleCategoryRetail = ["Food","Householdgood","ClothingFootwareAndPersonalAccessory","DepartmentStores","CafesResturantsAndTakeawayFood","Other"];
var possibleCategoryMerchandise = ["FoodAndLiveAnimals","BeveragesAndTobacco","CrudMaterialAndInedible","MineralFuelLubricentAndRelatedMaterial","AnimalAndVegitableOilFatAndWaxes","ChemicalsAndRelatedProducts","ManufacutedGoods","MachineryAndTransportEquipments","OtherManucacturedArticles","Unclassified"];

class CustomImpact extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        values :{
          food: 0,
          householdgood: 0,
          clothingFootwareAndPersonalAccessory:0,
          departmentStores:0,
          cafesResturantsAndTakeawayFood:0,
          other:0,
          foodAndLiveAnimals:0,
          beveragesAndTobacco:0,
          crudMaterialAndInedible:0,
          mineralFuelLubricentAndRelatedMaterial:0,
          animalAndVegitableOilFatAndWaxes:0,
          chemicalsAndRelatedProducts:0,
          manufacutedGoods:0,
          machineryAndTransportEquipments:0,
          otherManucacturedArticles:0,
          unclassified:0
        },
        outputs:null,
        currentSelect:null,
        addingValue:0,
        addedValues:"No Added Metrics"
      }

      this.handleChange = this.handleChange.bind(this);
      this.calculateChange = this.calculateChange.bind(this);
      this.formatSunburst = this.formatSunburst.bind(this);

      this.selectChange = this.selectChange.bind(this);
      this.selectChangeChange = this.selectChangeChange.bind(this);
      this.handleNormChange = this.handleNormChange.bind(this);
      this.addValue = this.addValue.bind(this);
    };

    componentWillMount(){
      var self = this;
      Meteor.call('getLeadUpNews',"2015-01-01","2017-01-01", function(err,res){
        self.setState({newsArticles:res});
      })
    };

    handleChange(event) {
      console.log(event);
      const target = event.target;
      const value = target.value;
      const name = target.name;
      var curr = this.state.values;
      curr[name] = value;
      this.setState({
        values:curr
      });
    };

    handleNormChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    };

    selectChange(val){
      console.log(val);
      this.setState({currentSelectRoot:val,currentSelect:val.value});
    }

    selectChangeChange(val){
      this.setState({currentMagnitudeRoot:val,currentMagnitudeSelect:val.value})
    }

    calculateChange(){
      var percentageChanges = {
        RetailTurnover:{
          food: 0,
          householdgood: 0,
          clothingFootwareAndPersonalAccessory:0,
          departmentStores:0,
          cafesResturantsAndTakeawayFood:0,
          other:0
        },
        MerchandiseExports :{
          foodAndLiveAnimals:0,
          beveragesAndTobacco:0,
          crudMaterialAndInedible:0,
          mineralFuelLubricentAndRelatedMaterial:0,
          animalAndVegitableOilFatAndWaxes:0,
          chemicalsAndRelatedProducts:0,
          manufacutedGoods:0,
          machineryAndTransportEquipments:0,
          otherManucacturedArticles:0,
          unclassified:0
        }
      };

      //the ratios which we have previously calculated
      //We intended to put this on an API call but ran out of time and found it unnessasary
      var ratios = {
        "food": {
          "food":1,
          "householdgood":0.1,
          "clothingFootwareAndPersonalAccessory":-0.5,
          "departmentStores":0.7,
          "cafesResturantsAndTakeawayFood":0.2,
          "other":-0.3,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0.3,
          "animalAndVegitableOilFatAndWaxes":-0.82,
          "chemicalsAndRelatedProducts":0.13,
          "manufacutedGoods":0.22,
          "machineryAndTransportEquipments":0.78,
          "otherManucacturedArticles":0.2,
          "unclassified":-.9
        },
        "householdgood": {
          "food":0.4,
          "householdgood":1,
          "clothingFootwareAndPersonalAccessory":-0.3,
          "departmentStores":0.2,
          "cafesResturantsAndTakeawayFood":0.1,
          "other":-.7,
          "foodAndLiveAnimals":0.7,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":-0.2,
          "mineralFuelLubricentAndRelatedMaterial":0.6,
          "animalAndVegitableOilFatAndWaxes":0.9,
          "chemicalsAndRelatedProducts":0.2,
          "manufacutedGoods":0.3,
          "machineryAndTransportEquipments":0.2,
          "otherManucacturedArticles":-0.5,
          "unclassified":0.4
        },
        "clothingFootwareAndPersonalAccessory": {
          "food":0.4,
          "householdgood":0.2,
          "clothingFootwareAndPersonalAccessory":1,
          "departmentStores":-0.4,
          "cafesResturantsAndTakeawayFood":0.6,
          "other":0.2,
          "foodAndLiveAnimals":0.3,
          "beveragesAndTobacco":-0.2,
          "crudMaterialAndInedible":0.1,
          "mineralFuelLubricentAndRelatedMaterial":-0.4,
          "animalAndVegitableOilFatAndWaxes":0.6,
          "chemicalsAndRelatedProducts":0.7,
          "manufacutedGoods":0.1,
          "machineryAndTransportEquipments":-0.2,
          "otherManucacturedArticles":0.3,
          "unclassified":0.1
        },
        "departmentStores": {
          "food":0.2,
          "householdgood":0.3,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":1,
          "cafesResturantsAndTakeawayFood":-0.3,
          "other":0.7,
          "foodAndLiveAnimals":0.2,
          "beveragesAndTobacco":-0.5,
          "crudMaterialAndInedible":-0.5,
          "mineralFuelLubricentAndRelatedMaterial":0.5,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0.3,
          "manufacutedGoods":0.8,
          "machineryAndTransportEquipments":0.2,
          "otherManucacturedArticles":0.3,
          "unclassified":0
        },
        "cafesResturantsAndTakeawayFood": {
          "food":0.3,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0.2,
          "departmentStores":0.6,
          "cafesResturantsAndTakeawayFood":1,
          "other":0.2,
          "foodAndLiveAnimals":-0.2,
          "beveragesAndTobacco":0.4,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0.2,
          "animalAndVegitableOilFatAndWaxes":0.9,
          "chemicalsAndRelatedProducts":-0.4,
          "manufacutedGoods":0.3,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":-0.4,
          "unclassified":0.1
        },
        "other": {
          "food":0.3,
          "householdgood":0.6,
          "clothingFootwareAndPersonalAccessory":0.1,
          "departmentStores":0.6,
          "cafesResturantsAndTakeawayFood":0.3,
          "other":1,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":-0.2,
          "crudMaterialAndInedible":0.2,
          "mineralFuelLubricentAndRelatedMaterial":0.3,
          "animalAndVegitableOilFatAndWaxes":0.2,
          "chemicalsAndRelatedProducts":-0.3,
          "manufacutedGoods":0.2,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0.7,
          "unclassified":0.3
        },
        "foodAndLiveAnimals": {
          "food":0.3,
          "householdgood":0.1,
          "clothingFootwareAndPersonalAccessory":-0.9,
          "departmentStores":-0.2,
          "cafesResturantsAndTakeawayFood":0.2,
          "other":-0.2,
          "foodAndLiveAnimals":1,
          "beveragesAndTobacco":0.3,
          "crudMaterialAndInedible":-0,
          "mineralFuelLubricentAndRelatedMaterial":-0.2,
          "animalAndVegitableOilFatAndWaxes":-0.4,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":-0.5,
          "machineryAndTransportEquipments":-0.7,
          "otherManucacturedArticles":-0.9,
          "unclassified":0
        },
        "beveragesAndTobacco": {
          "food":0.1,
          "householdgood":0.8,
          "clothingFootwareAndPersonalAccessory":0.4,
          "departmentStores":0.6,
          "cafesResturantsAndTakeawayFood":0,
          "other":0.5,
          "foodAndLiveAnimals":0.1,
          "beveragesAndTobacco":1,
          "crudMaterialAndInedible":-0.6,
          "mineralFuelLubricentAndRelatedMaterial":0.1,
          "animalAndVegitableOilFatAndWaxes":0.4,
          "chemicalsAndRelatedProducts":0.5,
          "manufacutedGoods":0.6,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0.2,
          "unclassified":0.5
        },
        "crudMaterialAndInedible": {
          "food":0.5,
          "householdgood":0.7,
          "clothingFootwareAndPersonalAccessory":0.6,
          "departmentStores":0.7,
          "cafesResturantsAndTakeawayFood":-0.6,
          "other":-0.6,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0.3,
          "crudMaterialAndInedible":1,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0.3,
          "chemicalsAndRelatedProducts":0.5,
          "manufacutedGoods":0.6,
          "machineryAndTransportEquipments":0.3,
          "otherManucacturedArticles":0.2,
          "unclassified":0.6
        },
        "mineralFuelLubricentAndRelatedMaterial": {
          "food":0.1,
          "householdgood":0.6,
          "clothingFootwareAndPersonalAccessory":-0.2,
          "departmentStores":-0.5,
          "cafesResturantsAndTakeawayFood":0,
          "other":-0.2,
          "foodAndLiveAnimals":0.5,
          "beveragesAndTobacco":0.1,
          "crudMaterialAndInedible":-0.5,
          "mineralFuelLubricentAndRelatedMaterial":1,
          "animalAndVegitableOilFatAndWaxes":0.1,
          "chemicalsAndRelatedProducts":0.5,
          "manufacutedGoods":0.6,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0.6,
          "unclassified":0.6
        },
        "animalAndVegitableOilFatAndWaxes": {
          "food":-0.4,
          "householdgood":0.2,
          "clothingFootwareAndPersonalAccessory":0.1,
          "departmentStores":0.3,
          "cafesResturantsAndTakeawayFood":-0.5,
          "other":-0.4,
          "foodAndLiveAnimals":-0.5,
          "beveragesAndTobacco":0.2,
          "crudMaterialAndInedible":0.2,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":1,
          "chemicalsAndRelatedProducts":0.4,
          "manufacutedGoods":0.5,
          "machineryAndTransportEquipments":0.1,
          "otherManucacturedArticles":0.5,
          "unclassified":0.1
        },
        "chemicalsAndRelatedProducts": {
          "food":0.9,
          "householdgood":0.3,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0.6,
          "cafesResturantsAndTakeawayFood":0.3,
          "other":0.2,
          "foodAndLiveAnimals":0.6,
          "beveragesAndTobacco":0.8,
          "crudMaterialAndInedible":0.1,
          "mineralFuelLubricentAndRelatedMaterial":0.2,
          "animalAndVegitableOilFatAndWaxes":-0.2,
          "chemicalsAndRelatedProducts":1,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":-0.2,
          "otherManucacturedArticles":0.4,
          "unclassified":0.2
        },
        "manufacutedGoods": {
          "food":0.2,
          "householdgood":0.4,
          "clothingFootwareAndPersonalAccessory":-0.3,
          "departmentStores":0.5,
          "cafesResturantsAndTakeawayFood":0.2,
          "other":0.5,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":-0.5,
          "crudMaterialAndInedible":0.2,
          "mineralFuelLubricentAndRelatedMaterial":0.5,
          "animalAndVegitableOilFatAndWaxes":0.6,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":1,
          "machineryAndTransportEquipments":0.1,
          "otherManucacturedArticles":0.4,
          "unclassified":0
        },
        "machineryAndTransportEquipments": {
          "food":0.5,
          "householdgood":0.2,
          "clothingFootwareAndPersonalAccessory":0.3,
          "departmentStores":-0.3,
          "cafesResturantsAndTakeawayFood":-0.2,
          "other":0.2,
          "foodAndLiveAnimals":0.2,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0.4,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":-0.3,
          "chemicalsAndRelatedProducts":0.4,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":1,
          "otherManucacturedArticles":0.5,
          "unclassified":0.4
        },
        "otherManucacturedArticles": {
          "food":0.5,
          "householdgood":0.2,
          "clothingFootwareAndPersonalAccessory":0.4,
          "departmentStores":-0.4,
          "cafesResturantsAndTakeawayFood":-0.4,
          "other":0.5,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0.5,
          "crudMaterialAndInedible":0.5,
          "mineralFuelLubricentAndRelatedMaterial":0.2,
          "animalAndVegitableOilFatAndWaxes":0.5,
          "chemicalsAndRelatedProducts":0.4,
          "manufacutedGoods":0.7,
          "machineryAndTransportEquipments":0.2,
          "otherManucacturedArticles":1,
          "unclassified":0.2
        },
        "otherManucacturedArticles": {
          "food":0.3,
          "householdgood":0.2,
          "clothingFootwareAndPersonalAccessory":0.2,
          "departmentStores":0.2,
          "cafesResturantsAndTakeawayFood":0.4,
          "other":-0.2,
          "foodAndLiveAnimals":-0.2,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0.8,
          "mineralFuelLubricentAndRelatedMaterial":0.9,
          "animalAndVegitableOilFatAndWaxes":0.6,
          "chemicalsAndRelatedProducts":0.8,
          "manufacutedGoods":0.9,
          "machineryAndTransportEquipments":0.3,
          "otherManucacturedArticles":0,
          "unclassified":1
        },
      }
      //for each element in the existing percentage changes
      //find its corresponding ratio object eg food = {house:3,other:4}
      // for each element in the ratio object
      //add the ratio object * state.values
      //set percentage change to this

      Object.entries(percentageChanges).forEach(([key,value]) => {
        var topLevel = key;
        Object.entries(value).forEach(([key,value]) => {
          var mainLevel = key;
          var currRatio = ratios[key];
          if (currRatio) {
            Object.entries(currRatio).forEach(([key,value]) => {
              percentageChanges[topLevel][mainLevel] = percentageChanges[topLevel][mainLevel] + (this.state.values[key] * value);
            });
            percentageChanges[topLevel][mainLevel] = percentageChanges[topLevel][mainLevel] / 100;
          };
        });
      });

      this.setState({percentageChanges:percentageChanges,sunburstData:this.formatSunburst(percentageChanges)})
    }

    formatSunburst(combinedPercents){ //format the sunburst data
      var base = {
        "name": "flare",
        "children": []};
      var i = 0;
      Object.entries(combinedPercents).forEach(([key,value]) => {
        // console.log(key,value);
        var topLevel = key;
        base.children.push({"name":key,"children":[]});
        // console.log(base);
        Object.entries(value).forEach(([key,value]) =>{
          base.children[i].children.push({"name":key,"size":value})
        })
        i++;
      });
      return(base);
    }

    addValue() { //when a user clicks add value
      if (this.state.addedValues!="No Added Metrics"){
        var current = this.state.addedValues;
      } else {
        var current = new Array();
      }


      var currentValues = this.state.values;
      currentValues[this.state.currentSelectRoot.value] = this.state.currentMagnitudeRoot.value;

      this.setState({values:currentValues});

      current.push(<div className = "row" id = "metricEntry">
                      <div id = "leftSide" className="col-md-6">
                        {this.state.currentSelectRoot.label}
                      </div>
                      <div id = "rightSide" className = "col-md-6">
                        {this.state.currentMagnitudeRoot.label}
                      </div>
                    </div>);

      this.setState({addedValues:current,currentSelect:null,currentSelectRoot:null,addingValue:0,currentMagnitudeRoot:null,});
    }

    render() {

      if (this.state.newsArticles){ //if we have loaded the news Articles data
        var textInput = <div className = "col-md-12">
          <br></br>
          <div className = "row" id = "rootBackAdd">
            <div id = "textAlignRight" className = "col-md-1 ">
              Area:
            </div>
            <div className = "col-md-4 ">
              <Select
                name= "state-selector"
                value= {this.state.currentSelect}
                options = {[{value:"food",label:"Food"},
                            {value:"householdgood",label:"Household good"},
                            {value:"clothingFootwareAndPersonalAccessory",label:"Clothing, Footware and Personal Accessories"},
                            {value:"departmentStores",label:"Department Stores"},
                            {value:"cafesResturantsAndTakeawayFood",label:"Cafes, Resturants and Takeaway Food"},
                            {value:"other",label:"Other retailing"},
                            {value:"foodAndLiveAnimals",label:"Food and Live Animals"},
                            {value:"beveragesAndTobacco",label:"Beverages and Tobacco"},
                            {value:"crudMaterialAndInedible",label:"Crud Material and Inedible"},
                            {value:"mineralFuelLubricentAndRelatedMaterial",label:"Mineral Fuel Lubricent and Related Material"},
                            {value:"animalAndVegitableOilFatAndWaxes",label:"Animal and Vegetable Oil,Fat and Waxes"},
                            {value:"chemicalsAndRelatedProducts",label:"Chemicals and Related Products"},
                            {value:"manufacutedGoods",label:"Manufactured Goods"},
                            {value:"machineryAndTransportEquipments",label:"Machinery and Transport Equipments"},
                            {value:"otherManucacturedArticles",label:"Other Manufactured Articles"},
                            {value:"unclassified",label:"Unclassified"}]}
                clearable = {false}
                onChange = {this.selectChange}
                className = "selectArea"
              />
            </div>
            <div id = "textAlignRight" className = "col-md-1">
              Magnitude:
            </div>
            <div className = "col-md-3">

                <Select
                  name= "state-selector"
                  value= {this.state.currentMagnitudeSelect}
                  options = {[
                              {value:20,label:"Strong Positive (+) Increase"},
                              {value:10,label:"Moderate Positive (+) Increase"},
                              {value:5,label:"Marginal Positive (+) Increase"},
                              {value:-5,label:"Marginal Negative (-) Decrease"},
                              {value:-10,label:"Moderate Negative (-) Decrease"},
                              {value:-25,label:"Strong Negative (-) Decrease"}]}
                  clearable = {false}
                  onChange = {this.selectChangeChange}
                  className = "selectArea"
                />
            </div>


            <div className = "col-md-2">
              <button id = "metricButton" type="button" className = "btn btn-default" id ="buttonAdd" onClick = {()=>{this.addValue()}}>
                Add impact metric (%)
              </button>
            </div>

          </div>
          <br></br>
          <div className = "row" id = "rootBack">
            {this.state.addedValues}
          </div>
          <br></br>
        </div>;
        if (this.state.percentageChanges && this.state.sunburstData){ //if we have calculated the changes and impact
          //find the top elements
          var topElements ={one:{Name:null,Value:null},two:{Name:null,Value:null},three:{Name:null,Value:null},four:{Name:null,Value:null}};
          Object.entries(this.state.percentageChanges).forEach(
            ([key1,value1]) => {
              Object.entries(this.state.percentageChanges[key1]).forEach(
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
          //calculate the prefixes
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
          //company links derived from CSV
          const companyLinks = {
            "food":[{stockCode:"T3D",stockName:"333D LIMITED",stockImpact:0.9},
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
            "householdgood":[{stockCode:"AHY",stockName:"ASALEO CARE LIMITED",stockImpact:0.9},
                    {stockCode:"BKL",stockName:"BLACKMORES LIMITED",stockImpact:0.9},
                    {stockCode:"BWX",stockName:"BWX LIMITED",stockImpact:0.9},
                    {stockCode:"HCT",stockName:"HOLISTA COLLTECH LIMITED",stockImpact:0.9},
                    {stockCode:"MHI",stockName:"MERCHANT HOUSE INTERNATIONAL LIMITED",stockImpact:0.9},
                    {stockCode:"PTL",stockName:"PENTAL LIMITED",stockImpact:0.9},
                    {stockCode:"SKN",stockName:"SKIN ELEMENTS LIMITED",stockImpact:0.9},
                    {stockCode:"NCK", stockName:"NIB HOLDINGS LIMITED", stockImpact:0.4},
                    {stockCode:"TIL",stockName:"TRILOGY INTERNATIONAL LIMITED",stockImpact:0.9}],
            "clothingFootwareAndPersonalAccessory":[{stockCode:"NNW",stockName:"99 WUXIAN LIMITED",stockImpact:0.4},
                    {stockCode:"ADH",stockName:"ADAIRS LIMITED",stockImpact:0.4},
                    {stockCode:"AMA",stockName:"AMA GROUP LIMITED",stockImpact:0.4},
                    {stockCode:"APE",stockName:"AP EAGERS LIMITED",stockImpact:0.4},
                    {stockCode:"AHG",stockName:"AUTOMOTIVE HOLDINGS GROUP LIMITED.",stockImpact:0.4},
                    {stockCode:"BBN",stockName:"BABY BUNTING GROUP LIMITED",stockImpact:0.4},
                    {stockCode:"BAP",stockName:"BAPCOR LIMITED",stockImpact:0.4},
                    {stockCode:"BDA",stockName:"BOD AUSTRALIA LIMITED",stockImpact:0.4}],
            "departmentStores":[{stockCode:"BLX",stockName:"BEACON LIGHTING GROUP LIMITED",stockImpact:0.7},
                    {stockCode:"BRG",stockName:"BREVILLE GROUP LIMITED",stockImpact:0.7},
                    {stockCode:"CCV",stockName:"CASH CONVERTERS INTERNATIONAL",stockImpact:0.7},
                    {stockCode:"CQR",stockName:"CHARTER HALL RETAIL REIT",stockImpact:0.7},
                    {stockCode:"DLC",stockName:"DELECTA LIMITED",stockImpact:0.7},
                    {stockCode:"FUN",stockName:"FUNTASTIC LIMITED",stockImpact:0.7},
                    {stockCode:"GFY",stockName:"GODFREYS GROUP LIMITED",stockImpact:0.7},
                    {stockCode:"HT8",stockName:"HARRIS TECHNOLOGY GROUP LIMITED",stockImpact:0.7}],
            "cafesResturantsAndTakeawayFood":[{stockCode:"RFG",stockName:"RETAIL FOOD GROUP LIMITED", stockImpact:0.5},
                    {stockCode:"DMP",stockName:"DOMINO'S PIZZA ENTERPRISES LIMITED", stockImpact:0.5}
                    ],
            "other":[{stockCode:"MPL",stockName:"MEDIBANK PRIVATE LIMITED", stockImpact:0.7},
                    {stockCode:"NFH",stockName:"NIB HOLDINGS LIMITED", stockImpact:0.6}
                    ],
            "foodAndLiveAnimals":[{stockCode:"PDF",stockName:"PACIFIC DAIRIES LIMITED",stockImpact:0.7},
                    {stockCode:"RGP",stockName:"REFRESH GROUP LIMITED",stockImpact:0.7},
                    {stockCode:"RFG",stockName:"RETAIL FOOD GROUP LIMITED",stockImpact:0.7},
                    {stockCode:"RIC",stockName:"RIDLEY CORPORATION LIMITED",stockImpact:0.7},
                    {stockCode:"SFG",stockName:"SEAFARMS GROUP LIMITED",stockImpact:0.7},
                    {stockCode:"SHV",stockName:"SELECT HARVESTS LIMITED",stockImpact:0.7}],
            "beveragesAndTobacco":[{stockCode: "CCL",stockCode:"COCA-COLA AMATIL LIMITED",stockCode:0.6}],
            "crudMaterialAndInedible":[{stockCode:"BHP",stockName:"BHP BILLITON LIMITED",stockImpact:0.9}],
            "mineralFuelLubricentAndRelatedMaterial":[{stockCode:"SXY", stockName:"SENEX ENERGY LIMITED", stockImpact:0.5},
                    {stockCode:"YAL", stockName:"YANCOAL AUSTRALIA L`IMITED", stockImpact:0.7},
                    {stockCode:"WPL", stockName:"WOODSIDE PETROLEUM LIMITED", stockImpact:0.4}],
            "animalAndVegitableOilFatAndWaxes":[{stockCode:"PTL", stockName:"PENTAL LIMITED", stockImpact:0.7}],
            "chemicalsAndRelatedProducts":[{stockCode:"ATC", stockName:"ALTECH CHEMICALS LTD", stockImpact:0.5},
                    {stockCode:"IPL", stockName:"INCITEC PIVOT LIMITED", stockImpact:0.6}
                  ],
            "manufacutedGoods":[{stockCode:"NUF", stockName:"NUFARM LIMITED", stockImpact:0.5},
                    {stockCode:"PGH", stockName:"PACT GROUP HOLDINGS LTD", stockImpact:0.6},
                    {stockCode:"JYC", stockName:"JOYCE CORPORATION LTD", stockImpact:0.8}],
            "machineryAndTransportEquipments":[{stockCode:"DOW", stockName:"DOWNER EDI LIMITED", stockImpact:0.6}],
            "otherManucacturedArticles":[]
          }

          var impactedCompanies = new Array();

          //calculate stock tiles
          Object.entries(this.state.percentageChanges).forEach(
            ([key1,value1]) => {
              Object.entries(this.state.percentageChanges[key1]).forEach(
                ([key2,value2]) => {
                  //  console.log(key2,Math.abs(value2));
                  if (Math.abs(value2)>0.05){
                    // console.log(key2,value2);
                    // console.log(companyLinks[key2])
                    if (companyLinks[key2]){
                      for (jiH=0;jiH< companyLinks[key2].length;jiH++){
                        var curr = companyLinks[key2][jiH];
                        var newsForCurrent = new Array();
                        var searchingCode = curr.stockCode +".AX";
                        var currentSentiment = 0;
                        for (newsCounter = 0; newsCounter< this.state.newsArticles.length;newsCounter++){
                          if (this.state.newsArticles[newsCounter].InstrumentIDs.includes(searchingCode)){
                            newsForCurrent.push(this.state.newsArticles[newsCounter]);
                            // console.log(this.state.newsArticles[newsCounter].Sentiment.Polarity);
                            currentSentiment=currentSentiment + this.state.newsArticles[newsCounter].Sentiment.Polarity;
                            // console.log(currentSentiment);

                          }
                        }
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
                        if (curr.stockImpact*value2)
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
          //generate impact statement
          var companyImpact = <div className = "col-md-12" key="companyImpact">
                      <div  id = "specificHeading" className= "row">
                        Company impact
                      </div>
                      <div className = "row">
                        {impactedCompanies}
                      </div>
                  </div>


          //retrun data
          return (<div className = "row">
                    <div id = "mainImpactTitle" className = "col-md-12">
                      Predictor
                    </div>
                    <div id = "predictorInfo" className = "col-md-12">
                      <div className = "row">
                        <div className = "col-md-10 col-md-offset-1">
                          Using all statistics data accessible through the Australian Bureau of Statistics, and an intelligent Neural-Network-based algorithm, we have been able to discover and correlate connections between different areas of Australian industry.
                        </div>
                      </div>
                      <div className = "row" >
                        <div className = "col-md-10 col-md-offset-1">
                          By adding an area of statistics below (e.g. Manufactured Goods) and selecting the impact it experiences (say a strong negative downward trend) you can then view how it will affect the rest of Australian Statisitcs.
                        </div>
                      </div>
                    </div>
                    {textInput}
                    <div className = "col-md-12"id ="briefsRoot" key = "mainImpact">
                      <div  id = "impactType" className= "row">
                        Percentile impact
                      </div>
                      <div className = "row">
                        <div className ="col-md-6">
                          <Sunburst data={this.state.sunburstData}/>
                        </div>
                        <div className = "col-md-6">
                          <div className = "row">
                            <div id = "percentageDisp" className = "col-md-6">
                              <div id = "percentage" className = "row">{prefixOne + d3.round(topElements.one.Value*100,2)+'%'}</div>
                              <div id = "identifier" className = "row">{topElements.one.Name}</div>
                            </div>
                            <div id = "percentageDisp" className = "col-md-6">
                              <div id = "percentage" className = "row">{prefixTwo + d3.round(topElements.two.Value*100,2)+'%'}</div>
                              <div id = "identifier" className = "row">{topElements.two.Name}</div>
                            </div>
                          </div>
                          <div className = "row">
                            <div id = "percentageDisp" className = "col-md-6">
                              <div id = "percentage" className = "row">{prefixThree + d3.round(topElements.three.Value*100,2)+'%'}</div>
                              <div id = "identifier" className = "row">{topElements.three.Name}</div>
                            </div>
                            <div id = "percentageDisp" className = "col-md-6">
                              <div id = "percentage" className = "row">{prefixFour + d3.round(topElements.four.Value*100,2)+'%'}</div>
                              <div id = "identifier" className = "row">{topElements.four.Name}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {companyImpact}
                  </div>)
        } else { //we do not have any calculations made yet
          return (<div className = "row">
                    <div id = "mainImpactTitle" className = "col-md-12">
                      Predictor
                    </div>
                    <div id = "predictorInfo" className = "col-md-12">
                      <div id = "heading" className="row">
                        How it works
                      </div>
                      <div id = "textRow" className = "row">
                        <div className = "col-md-10 col-md-offset-1">
                          Using all statistics data accessible through the Australian Bureau of Statistics, and an intelligent Neural-Network-based algorithm, we have been able to discover and correlate connections between different areas of Australian industry.
                        </div>
                      </div>
                      <div id = "textRow" className = "row" >
                        <div className = "col-md-10 col-md-offset-1">
                         By adding an area of statistics below (e.g. Manufactured Goods) and selecting the impact it experiences (say a strong negative downward trend) you can then view how it will affect the rest of Australian Statisitcs.
                        </div>
                      </div>
                    </div>

                    {textInput}
                    <div className = "col-md-12" id = "rootBack">
                      <button id = "calculateChange" type="button" onClick = {this.calculateChange} className = "col-md-2 col-md-offset-5 btn btn-default">
                        Calculate
                      </button>
                    </div>

                  </div>)
        }
      } else { //still loading news data needed for sentiment
        return (<div>
          Loading...
        </div>)
      }


    }
}

export default CustomImpact;
