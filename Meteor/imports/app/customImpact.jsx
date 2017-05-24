import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

import Sunburst from '/imports/app/d3test.jsx';

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
        outputs:null
      }

      this.handleChange = this.handleChange.bind(this);
      this.calculateChange = this.calculateChange.bind(this);
      this.formatSunburst = this.formatSunburst.bind(this);
    };

    componentWillMount(){
      //load data for given dates one year ago
    };

    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;
      var curr = this.state.values;
      curr[name] = value;
      this.setState({
        values:curr
      });
    };

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
          "clothingFootwareAndPersonalAccessory":0.1,
          "departmentStores":1,
          "cafesResturantsAndTakeawayFood":-0.3,
          "other":0.7,
          "foodAndLiveAnimals":0.2,
          "beveragesAndTobacco":-0.5,
          "crudMaterialAndInedible":-0.5,
          "mineralFuelLubricentAndRelatedMaterial":0.5,
          "animalAndVegitableOilFatAndWaxes":0.4,
          "chemicalsAndRelatedProducts":0.3,
          "manufacutedGoods":0.8,
          "machineryAndTransportEquipments":0.2,
          "otherManucacturedArticles":0.3,
          "unclassified":0.1
        },
        "cafesResturantsAndTakeawayFood": {
          "food":0.3,
          "householdgood":0.4,
          "clothingFootwareAndPersonalAccessory":0.2,
          "departmentStores":0.6,
          "cafesResturantsAndTakeawayFood":1,
          "other":0.2,
          "foodAndLiveAnimals":-0.2,
          "beveragesAndTobacco":0.4,
          "crudMaterialAndInedible":0.6,
          "mineralFuelLubricentAndRelatedMaterial":0.2,
          "animalAndVegitableOilFatAndWaxes":0.9,
          "chemicalsAndRelatedProducts":-0.4,
          "manufacutedGoods":0.3,
          "machineryAndTransportEquipments":0.1,
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
          "foodAndLiveAnimals":0.9,
          "beveragesAndTobacco":-0.2,
          "crudMaterialAndInedible":0.2,
          "mineralFuelLubricentAndRelatedMaterial":0.3,
          "animalAndVegitableOilFatAndWaxes":0.2,
          "chemicalsAndRelatedProducts":-0.3,
          "manufacutedGoods":0.2,
          "machineryAndTransportEquipments":0.1,
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
          "crudMaterialAndInedible":-0.6,
          "mineralFuelLubricentAndRelatedMaterial":-0.2,
          "animalAndVegitableOilFatAndWaxes":-0.4,
          "chemicalsAndRelatedProducts":-0.5,
          "manufacutedGoods":-0.5,
          "machineryAndTransportEquipments":-0.7,
          "otherManucacturedArticles":-0.9,
          "unclassified":-0.5
        },
        "beveragesAndTobacco": {
          "food":0.1,
          "householdgood":0.8,
          "clothingFootwareAndPersonalAccessory":0.4,
          "departmentStores":0.6,
          "cafesResturantsAndTakeawayFood":-0.4,
          "other":0.5,
          "foodAndLiveAnimals":0.1,
          "beveragesAndTobacco":1,
          "crudMaterialAndInedible":-0.6,
          "mineralFuelLubricentAndRelatedMaterial":0.1,
          "animalAndVegitableOilFatAndWaxes":0.4,
          "chemicalsAndRelatedProducts":0.5,
          "manufacutedGoods":0.6,
          "machineryAndTransportEquipments":0.8,
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
          "foodAndLiveAnimals":0.6,
          "beveragesAndTobacco":0.3,
          "crudMaterialAndInedible":1,
          "mineralFuelLubricentAndRelatedMaterial":0.2,
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
          "cafesResturantsAndTakeawayFood":-0.2,
          "other":-0.2,
          "foodAndLiveAnimals":0.5,
          "beveragesAndTobacco":0.1,
          "crudMaterialAndInedible":-0.5,
          "mineralFuelLubricentAndRelatedMaterial":1,
          "animalAndVegitableOilFatAndWaxes":0.1,
          "chemicalsAndRelatedProducts":0.5,
          "manufacutedGoods":0.6,
          "machineryAndTransportEquipments":0.2,
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
          "mineralFuelLubricentAndRelatedMaterial":0.4,
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
          "clothingFootwareAndPersonalAccessory":0.6,
          "departmentStores":0.6,
          "cafesResturantsAndTakeawayFood":0.3,
          "other":0.2,
          "foodAndLiveAnimals":0.6,
          "beveragesAndTobacco":0.8,
          "crudMaterialAndInedible":0.1,
          "mineralFuelLubricentAndRelatedMaterial":0.2,
          "animalAndVegitableOilFatAndWaxes":-0.2,
          "chemicalsAndRelatedProducts":1,
          "manufacutedGoods":0.4,
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
          "foodAndLiveAnimals":0.6,
          "beveragesAndTobacco":-0.5,
          "crudMaterialAndInedible":0.2,
          "mineralFuelLubricentAndRelatedMaterial":0.5,
          "animalAndVegitableOilFatAndWaxes":0.6,
          "chemicalsAndRelatedProducts":0.8,
          "manufacutedGoods":1,
          "machineryAndTransportEquipments":0.1,
          "otherManucacturedArticles":0.4,
          "unclassified":0.6
        },
        "machineryAndTransportEquipments": {
          "food":0.5,
          "householdgood":0.2,
          "clothingFootwareAndPersonalAccessory":0.3,
          "departmentStores":-0.3,
          "cafesResturantsAndTakeawayFood":-0.2,
          "other":0.2,
          "foodAndLiveAnimals":0.2,
          "beveragesAndTobacco":0.4,
          "crudMaterialAndInedible":0.4,
          "mineralFuelLubricentAndRelatedMaterial":0.2,
          "animalAndVegitableOilFatAndWaxes":-0.3,
          "chemicalsAndRelatedProducts":0.4,
          "manufacutedGoods":0.5,
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
          "foodAndLiveAnimals":0.44,
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
          "beveragesAndTobacco":0.5,
          "crudMaterialAndInedible":0.8,
          "mineralFuelLubricentAndRelatedMaterial":0.9,
          "animalAndVegitableOilFatAndWaxes":0.6,
          "chemicalsAndRelatedProducts":0.8,
          "manufacutedGoods":0.9,
          "machineryAndTransportEquipments":0.3,
          "otherManucacturedArticles":0.3,
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

    formatSunburst(combinedPercents){
      var base = {
        "name": "flare",
        "children": []};
      var i = 0;
      Object.entries(combinedPercents).forEach(([key,value]) => {
        console.log(key,value);
        var topLevel = key;
        base.children.push({"name":key,"children":[]});
        console.log(base);
        Object.entries(value).forEach(([key,value]) =>{
          base.children[i].children.push({"name":key,"size":value})
        })
        i++;
      });
      return(base);
    }

    render() {
      console.log(this.state);
      // this.calculateChange();

      var textInput = <div className = "col-md-12">
        <br></br>
        <div className = "row" id = "rootBack">
          <div className = "col-md-6">
            <div className = "row" id = "sectionHeading">
              Retail and Trade
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Food
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "food" value={this.state.values.food} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Householdgood
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "householdgood" value={this.state.values.householdgood} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Clothing, Footware and Personal Accessories
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "clothingFootwareAndPersonalAccessory" value={this.state.values.clothingFootwareAndPersonalAccessory} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                DepartmentStores
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "departmentStores" value={this.state.values.departmentStores} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Cafes, Resturants and Takeaway Food
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "cafesResturantsAndTakeawayFood" value={this.state.values.cafesResturantsAndTakeawayFood} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Other
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "other" value={this.state.values.other} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
          <div className = "col-md-6">
            <div className="row" id="sectionHeading">
              Merchandise Exports
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Food and Live Animals
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "foodAndLiveAnimals" value={this.state.values.foodAndLiveAnimals} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Beverages and Tobacco
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "beveragesAndTobacco" value={this.state.values.beveragesAndTobacco} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Crud Material and Inedible
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "crudMaterialAndInedible" value={this.state.values.crudMaterialAndInedible} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Mineral Fuel Lubricent and Related Material
              </div>
              <div className = "col-md-4">
                <input id ="catInput" type = "number" name = "mineralFuelLubricentAndRelatedMaterial" value={this.state.values.mineralFuelLubricentAndRelatedMaterial} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Animal and Vegetable Oil,Fat and Waxes
              </div>
              <div className = "col-md-4">
                <input id="catInput" type = "number" name = "animalAndVegitableOilFatAndWaxes" value={this.state.values.animalAndVegitableOilFatAndWaxes} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Chemicals and Related Products
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "chemicalsAndRelatedProducts" value={this.state.values.chemicalsAndRelatedProducts} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Manufactured Goods
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "manufacutedGoods" value={this.state.values.manufacutedGoods} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Machinery and Transport Equipments
              </div>
              <div className = "col-md-4">
                <input id="catInput" type = "number" name = "machineryAndTransportEquipments" value={this.state.values.machineryAndTransportEquipments} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Other Manufactured Articles
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "otherManucacturedArticles" value={this.state.values.otherManucacturedArticles} onChange={this.handleChange}/>
              </div>
            </div>
            <div className = "row">
              <div id = "catTitle" className="col-md-6 col-md-offset-1">
                Unclassified
              </div>
              <div className = "col-md-4">
                <input id = "catInput" type = "number" name = "unclassified" value={this.state.values.unclassified} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div className = "row" id = "rootBack">
          <div id = "calculateChange" onClick = {this.calculateChange} className = "col-md-2 col-md-offset-5">
            Calculate
          </div>
        </div>
      </div>;
      if (this.state.percentageChanges && this.state.sunburstData){
        console.log(this.state.percentageChanges)

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
        return (<div className = "row">
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
                  </div>;
                </div>)
      } else {
        return (<div className = "row">
                  {textInput}
                </div>)
      }
    }
}

export default CustomImpact;
