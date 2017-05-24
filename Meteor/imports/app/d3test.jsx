import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';


class D3Test extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        rooty : this.props.data
      }
      this.doEverything = this.doEverything.bind(this);
      this.stash = this.stash.bind(this);
      this.arcTween = this.arcTween.bind(this);
      this.getAncestors = this.getAncestors.bind(this);
      this.sickFadeBro = this.sickFadeBro.bind(this);
      this.fixName = this.fixName.bind(this);
      //console.log(this.props.data);
      // var tempRooty = this.state.rooty;
      // //tempRooty[0].value = 6;
      // //tempRooty[1].value = 6;
      // console.log("temp root next");
      // console.log(tempRooty.children[0].children[0]);
      // var i = 0;
      // var j = 0;
      // var temp = 0;
      // var tempObj;
      // while(i<2){
      //   while(j<6){
      //     temp += tempRooty.children[i].children[j];
      //     j++;
      //   }
      //   tempObj = {name : tempRooty.children[i].name, value : temp, children : tempRooty.children[i].children};
      //   console.log(tempObj);
      //   i++;
      // }
    }

  componentDidMount(){
    //console.log(this.state.rooty);
    var d = this.doEverything();
    this.sickFadeBro(d);
  }

  componentDidUpdate(){
    this.doEverything();
  }



    // Stash the old values for transition.
stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}

getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

doEverything() {
    var width = 700,
    height = 600,
    // radius = Math.min(width, height) / 2,
    radius = 275,
    color = d3.scale.category20().domain(d3.range(-1,1));
    var totalSize = 0;

    console.log("this is the radius: "+radius);


  var svg = d3.select(".d3Holder").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) {
      if (d.size > 0){
        return d.size;
      }
      return d.size*(-1);
    });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

  var root = this.state.rooty;

  svg.append("svg:circle")
      .attr("r", radius)
      .attr("id", "container")
      .style("opacity", 0);

  var path = svg.datum(root).selectAll("path")
      .data(partition.nodes)
    .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .attr("stroke-width", '2px')
      .style("stroke", function(d){
        if (d.name == 'RetailTurnover' || d.name == 'MerchandiseExports'){
          return 'white';
        } else if (d.size < 0){
          return 'red';
        }
          return 'MediumSeaGreen';
      })
      .style("fill", function(d) {
        if (d.name == 'MerchandiseExports'){
          return 'DodgerBlue';
        } else if (d.name == 'RetailTurnover'){
          return 'Crimson';
        } else if (d.name == 'Mineral fuels, lubricants and related materials' || d.name == 'mineralFuelLubricentAndRelatedMaterial'){
          return 'black';
        } else if (d.name == 'Crude materials, inedible, except fuels' || d.name == 'crudMaterialAndInedible'){
          return 'brown';
        } else if (d.name == 'Manufactured goods classified chiefly by material' || d.name == 'manufacutedGoods'){
          return 'grey';
        } else if (d.name == 'Food and live animals' || d.name == 'foodAndLiveAnimals'){
          return 'Salmon';
        } else if (d.name == 'Beverages and tobacco' || d.name == 'beveragesAndTobacco'){
          return  'orange';
        } else if (d.name == 'Animal and vegetable oils, fats and waxes' || d.name == 'animalAndVegitableOilFatAndWaxes'){
          return 'Goldenrod';
        } else if (d.name == 'Food retailing' || d.name == 'food'){
          return 'MediumVioletRed';
        } else if (d.name == 'Other retailing' || d.name == 'other'){
          return 'Tan';
        } else if (d.name == 'Department stores' || d.name == 'departmentStores'){
          return 'Khaki';
        } else if (d.name == 'Chemicals and related products, nes' || d.name == 'chemicalsAndRelatedProducts'){
          return 'MediumSeaGreen';
        } else if (d.name == 'Cafes, restaurants and takeaway food services' || d.name == 'cafesResturantsAndTakeawayFood'){
          return 'RosyBrown';
        } else if (d.name == 'Commodities and transactions not classified elsewhere in the SITC' || d.name == 'unclassified'){
          return 'DarkGreen';
        } else if (d.name == 'Machinery and transport equipment' || d.name == 'machineryAndTransportEquipments'){
          return 'DarkSlateGray';
        } else if (d.name == 'Household goods retailing' || d.name == 'householdgood'){
          return 'Teal';
        } else if (d.name == 'Clothing, footwear and personal accessory retailing' || d.name == 'clothingFootwareAndPersonalAccessory'){
          return 'SaddleBrown';
        } else if (d.name == 'Miscellaneous manufactured articles' || d.name == 'otherManucacturedArticles'){
          return 'Gold';
        }
        console.log("wrongText is : "+d.name);

        return 'red';
        //return  color((d.children ? d : d.parent).name);
      })
      .style("stroke-opacity", function(d){
        if (d.name == 'RetailTurnover' || d.name == 'MerchandiseExports'){
          return '0';
        } else if (d.size < 0){
          return '0.8';
        }
          return '0.7';
      })
      .style("fill-rule", "evenodd")
      .each(this.stash)
      .on("mouseover", function(d){
        //this.handleMouseOver(d);
        // console.log("MOUSING OVER");

        // var percentage = (100 * d.value / totalSize).toPrecision(3);
        // var percentageString = percentage + "%";
        // if (percentage < 0.1) {
        //   percentageString = "< 0.1%";
        // }
        if (d.name == 'RetailTurnover' || d.name == 'MerchandiseExports'){
          var percentage = d3.round(d.value*100, 2);
        } else {
          var percentage = d3.round(d.size*100, 2);
        }
        //console.log("THIS IS THE PERCENTAGE: "+percentage+" here is the value: "+d.value);
        var percentageString = percentage + "%";

        d3.select("#percentage")
          .text(percentageString);

        var goodName = d.name;
        if (d.name == 'Mineral fuels, lubricants and related materials' || d.name == 'mineralFuelLubricentAndRelatedMaterial'){
          goodName = 'Mineral fuels, lubricants and related materials';
        } else if (d.name == 'Crude materials, inedible, except fuels' || d.name == 'crudMaterialAndInedible'){
          goodName = 'Crude materials, inedible, except fuels';
        } else if (d.name == 'Manufactured goods classified chiefly by material' || d.name == 'manufacutedGoods'){
          goodName = 'Manufactured goods classified chiefly by material';
        } else if (d.name == 'Food and live animals' || d.name == 'foodAndLiveAnimals'){
          goodName = 'Food and live animals';
        } else if (d.name == 'Beverages and tobacco' || d.name == 'beveragesAndTobacco'){
          goodName =  'Beverages and tobacco';
        } else if (d.name == 'Animal and vegetable oils, fats and waxes' || d.name == 'animalAndVegitableOilFatAndWaxes'){
          goodName = 'Animal and vegetable oils, fats and waxes';
        } else if (d.name == 'Food retailing' || d.name == 'food'){
          goodName = 'Food retailing';
        } else if (d.name == 'Other retailing' || d.name == 'other'){
          goodName = 'Other retailing';
        } else if (d.name == 'Department stores' || d.name == 'departmentStores'){
          goodName = 'Department stores';
        } else if (d.name == 'Chemicals and related products, nes' || d.name == 'chemicalsAndRelatedProducts'){
          goodName = 'Chemicals and related products, nes';
        } else if (d.name == 'Cafes, restaurants and takeaway food services' || d.name == 'cafesResturantsAndTakeawayFood'){
          goodName = 'Cafes, restaurants and takeaway food services';
        } else if (d.name == 'Commodities and transactions not classified elsewhere in the SITC' || d.name == 'unclassified'){
          goodName = 'Commodities and transactions not classified elsewhere in the SITC';
        } else if (d.name == 'Machinery and transport equipment' || d.name == 'machineryAndTransportEquipments'){
          goodName = 'Machinery and transport equipment';
        } else if (d.name == 'Household goods retailing' || d.name == 'householdgood'){
          goodName = 'Household goods retailing';
        } else if (d.name == 'Clothing, footwear and personal accessory retailing' || d.name == 'clothingFootwareAndPersonalAccessory'){
          goodName = 'Clothing, footwear and personal accessory retailing';
        } else if (d.name == 'Miscellaneous manufactured articles' || d.name == 'otherManucacturedArticles'){
          goodName = 'Miscellaneous manufactured articles';
        }



        d3.select("#dataName")
          .text(goodName);

        var path = [];
        var current = d;
        while (current.parent) {
        path.unshift(current);
        current = current.parent;
        }
        //var sequenceArray = this.getAncestors(d);
        var sequenceArray = path;
        //fade everything
        d3.selectAll("path")
            .style("opacity", 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        svg.selectAll("path")
            .filter(function(node) {
                      return (sequenceArray.indexOf(node) >= 0);
                    })
            .style("opacity", 1);
      });


  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseout", function(d){
        console.log("MOUSE LEAVING");
          // // Transition each segment to full opacity and then reactivate it.
        d3.selectAll("path")
            .transition()
            .duration(1000)
            .style("opacity", 1);
            // .on("end", function() {
            //         d3.select(this).on("mouseover", mouseover);
            //       });
      });

    totalSize = path.node().__data__.value;

    //sickFadeBro(d);

d3.select(self.frameElement).style("height", height + "px");

  return d3;

}

fixName(d){
        if (d.name == 'Mineral fuels, lubricants and related materials' || d.name == 'mineralFuelLubricentAndRelatedMaterial'){
          return 'Mineral fuels, lubricants and related materials';
        } else if (d.name == 'Crude materials, inedible, except fuels' || d.name == 'crudMaterialAndInedible'){
          return 'Crude materials, inedible, except fuels';
        } else if (d.name == 'Manufactured goods classified chiefly by material' || d.name == 'manufacutedGoods'){
          return 'Manufactured goods classified chiefly by material';
        } else if (d.name == 'Food and live animals' || d.name == 'foodAndLiveAnimals'){
          return 'Food and live animals';
        } else if (d.name == 'Beverages and tobacco' || d.name == 'beveragesAndTobacco'){
          return  'Beverages and tobacco';
        } else if (d.name == 'Animal and vegetable oils, fats and waxes' || d.name == 'animalAndVegitableOilFatAndWaxes'){
          return 'Animal and vegetable oils, fats and waxes';
        } else if (d.name == 'Food retailing' || d.name == 'food'){
          return 'Food retailing';
        } else if (d.name == 'Other retailing' || d.name == 'other'){
          return 'Other retailing';
        } else if (d.name == 'Department stores' || d.name == 'departmentStores'){
          return 'Khaki';
        } else if (d.name == 'Chemicals and related products, nes' || d.name == 'chemicalsAndRelatedProducts'){
          return 'Chemicals and related products, nes';
        } else if (d.name == 'Cafes, restaurants and takeaway food services' || d.name == 'cafesResturantsAndTakeawayFood'){
          return 'Cafes, restaurants and takeaway food services';
        } else if (d.name == 'Commodities and transactions not classified elsewhere in the SITC' || d.name == 'unclassified'){
          return 'Commodities and transactions not classified elsewhere in the SITC';
        } else if (d.name == 'Machinery and transport equipment' || d.name == 'machineryAndTransportEquipments'){
          return 'Machinery and transport equipment';
        } else if (d.name == 'Household goods retailing' || d.name == 'householdgood'){
          return 'Household goods retailing';
        } else if (d.name == 'Clothing, footwear and personal accessory retailing' || d.name == 'clothingFootwareAndPersonalAccessory'){
          return 'Clothing, footwear and personal accessory retailing';
        } else if (d.name == 'Miscellaneous manufactured articles' || d.name == 'otherManucacturedArticles'){
          return 'Miscellaneous manufactured articles';
        }
        return 'MISTAKE';
}

  sickFadeBro(d){
    console.log("FADED");
    d3.selectAll("path")
      .style("opacity", 0.05);

    d3.selectAll("path")
     .transition()
     .duration(2000)
     .style("opacity", 1);

  }

  stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
  }

  // Interpolate the arcs in data space.
  arcTween(a) {
    var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
    return function(t) {
      var b = i(t);
      a.x0 = b.x;
      a.dx0 = b.dx;
      return arc(b);
    };
  }


render() {
      return(
        <div id="D3Padder">
        <div className="d3Holder">
          <div id="explanation">
            <span id="percentage"></span><br/>
            <span id="dataName"></span><br/>
          </div>
        </div>
        </div>
        );

    }
  }

  export default D3Test;
