import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import Sunburst from '/imports/app/d3test.jsx';

var possibleCategoryRetail = ["Food","Householdgood","ClothingFootwareAndPersonalAccessory","DepartmentStores","CafesResturantsAndTakeawayFood","Other"];
var possibleCategoryMerchandise = ["FoodAndLiveAnimals","BeveragesAndTobacco","CrudMaterialAndInedible","MineralFuelLubricentAndRelatedMaterial","AnimalAndVegitableOilFatAndWaxes","ChemicalsAndRelatedProducts","ManufacutedGoods","MachineryAndTransportEquipments","OtherManucacturedArticles","Unclassified"];

class CustomImpact extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        values :{
          food:0,
          householdgood:0,
          clothingFootwareAndPersonalAccessory:0,
          departmentStores:0,
          other:0
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
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "householdgood": {
          "food":0,
          "householdgood":1,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "clothingFootwareAndPersonalAccessory": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":1,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "departmentStores": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":1,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "cafesResturantsAndTakeawayFood": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":1,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "other": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":1,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "foodAndLiveAnimals": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":1,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "beveragesAndTobacco": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":1,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "crudMaterialAndInedible": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":1,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "mineralFuelLubricentAndRelatedMaterial": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":1,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "animalAndVegitableOilFatAndWaxes": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":1,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "chemicalsAndRelatedProducts": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":1,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "manufacutedGoods": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":1,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "machineryAndTransportEquipments": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":1,
          "otherManucacturedArticles":0,
          "unclassified":0
        },
        "otherManucacturedArticles": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
          "otherManucacturedArticles":1,
          "unclassified":0
        },
        "otherManucacturedArticles": {
          "food":0,
          "householdgood":0,
          "clothingFootwareAndPersonalAccessory":0,
          "departmentStores":0,
          "cafesResturantsAndTakeawayFood":0,
          "other":0,
          "foodAndLiveAnimals":0,
          "beveragesAndTobacco":0,
          "crudMaterialAndInedible":0,
          "mineralFuelLubricentAndRelatedMaterial":0,
          "animalAndVegitableOilFatAndWaxes":0,
          "chemicalsAndRelatedProducts":0,
          "manufacutedGoods":0,
          "machineryAndTransportEquipments":0,
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
      if (this.state.percentageChanges && this.state.sunburstData){
        return (<div className = "row">
                  Food <input type = "number" name = "food" value={this.state.values.food} onChange={this.handleChange}/>
                  Householdgood <input type = "number" name = "householdgood" value={this.state.values.householdgood} onChange={this.handleChange}/>
                  ClothingFootwareAndPersonalAccessory <input type = "number" name = "clothingFootwareAndPersonalAccessory" value={this.state.clothingFootwareAndPersonalAccessory} onChange={this.handleChange}/>
                  DepartmentStores <input type = "number" name = "departmentStores" value={this.state.values.departmentStores} onChange={this.handleChange}/>
                  CafesResturantsAndTakeawayFood <input type = "number" name = "cafesResturantsAndTakeawayFood" value={this.state.values.cafesResturantsAndTakeawayFood} onChange={this.handleChange}/>
                  Other <input type = "number" name = "other" value={this.state.values.other} onChange={this.handleChange}/>

                  FoodAndLiveAnimals <input type = "number" name = "foodAndLiveAnimals" value={this.state.values.foodAndLiveAnimals} onChange={this.handleChange}/>
                  BeveragesAndTobacco <input type = "number" name = "beveragesAndTobacco" value={this.state.values.beveragesAndTobacco} onChange={this.handleChange}/>
                  CrudMaterialAndInedible <input type = "number" name = "crudMaterialAndInedible" value={this.state.values.crudMaterialAndInedible} onChange={this.handleChange}/>
                  MineralFuelLubricentAndRelatedMaterial <input type = "number" name = "mineralFuelLubricentAndRelatedMaterial" value={this.state.values.mineralFuelLubricentAndRelatedMaterial} onChange={this.handleChange}/>
                  AnimalAndVegitableOilFatAndWaxes <input type = "number" name = "animalAndVegitableOilFatAndWaxes" value={this.state.values.animalAndVegitableOilFatAndWaxes} onChange={this.handleChange}/>
                  ChemicalsAndRelatedProducts <input type = "number" name = "chemicalsAndRelatedProducts" value={this.state.values.chemicalsAndRelatedProducts} onChange={this.handleChange}/>
                  ManufacturedGoods <input type = "number" name = "manufacutedGoods" value={this.state.values.manufacutedGoods} onChange={this.handleChange}/>
                  MachineryAndTransportEquipments <input type = "number" name = "machineryAndTransportEquipments" value={this.state.values.machineryAndTransportEquipments} onChange={this.handleChange}/>
                  OtherManucacturedArticles <input type = "number" name = "otherManucacturedArticles" value={this.state.values.otherManucacturedArticles} onChange={this.handleChange}/>
                  Unclassified <input type = "number" name = "unclassified" value={this.state.values.unclassified} onChange={this.handleChange}/>

                <Sunburst data = {this.state.sunburstData}/>
                  <div onClick = {this.calculateChange}> click</div>

                </div>)
      } else {
        return (<div className = "row">
                  Food <input type = "number" name = "food" value={this.state.values.food} onChange={this.handleChange}/>
                  Householdgood <input type = "number" name = "householdgood" value={this.state.values.householdgood} onChange={this.handleChange}/>
                  ClothingFootwareAndPersonalAccessory <input type = "number" name = "clothingFootwareAndPersonalAccessory" value={this.state.clothingFootwareAndPersonalAccessory} onChange={this.handleChange}/>
                  DepartmentStores <input type = "number" name = "departmentStores" value={this.state.values.departmentStores} onChange={this.handleChange}/>
                  CafesResturantsAndTakeawayFood <input type = "number" name = "cafesResturantsAndTakeawayFood" value={this.state.values.cafesResturantsAndTakeawayFood} onChange={this.handleChange}/>
                  Other <input type = "number" name = "other" value={this.state.values.other} onChange={this.handleChange}/>

                  FoodAndLiveAnimals <input type = "number" name = "foodAndLiveAnimals" value={this.state.values.foodAndLiveAnimals} onChange={this.handleChange}/>
                  BeveragesAndTobacco <input type = "number" name = "beveragesAndTobacco" value={this.state.values.beveragesAndTobacco} onChange={this.handleChange}/>
                  CrudMaterialAndInedible <input type = "number" name = "crudMaterialAndInedible" value={this.state.values.crudMaterialAndInedible} onChange={this.handleChange}/>
                  MineralFuelLubricentAndRelatedMaterial <input type = "number" name = "mineralFuelLubricentAndRelatedMaterial" value={this.state.values.mineralFuelLubricentAndRelatedMaterial} onChange={this.handleChange}/>
                  AnimalAndVegitableOilFatAndWaxes <input type = "number" name = "animalAndVegitableOilFatAndWaxes" value={this.state.values.animalAndVegitableOilFatAndWaxes} onChange={this.handleChange}/>
                  ChemicalsAndRelatedProducts <input type = "number" name = "chemicalsAndRelatedProducts" value={this.state.values.chemicalsAndRelatedProducts} onChange={this.handleChange}/>
                  ManufacturedGoods <input type = "number" name = "manufacutedGoods" value={this.state.values.manufacutedGoods} onChange={this.handleChange}/>
                  MachineryAndTransportEquipments <input type = "number" name = "machineryAndTransportEquipments" value={this.state.values.machineryAndTransportEquipments} onChange={this.handleChange}/>
                  OtherManucacturedArticles <input type = "number" name = "otherManucacturedArticles" value={this.state.values.otherManucacturedArticles} onChange={this.handleChange}/>
                  Unclassified <input type = "number" name = "unclassified" value={this.state.values.unclassified} onChange={this.handleChange}/>

                <div onClick = {this.calculateChange}> click</div>
                </div>)
      }
    }
}

export default CustomImpact;
