import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

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
        }
      }

      this.handleChange = this.handleChange.bind(this);
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
      
    }

    render() {
      console.log(this.state);
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
              </div>)
    }
}

export default CustomImpact;
