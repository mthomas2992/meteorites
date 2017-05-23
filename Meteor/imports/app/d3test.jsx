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
      console.log(this.props.data);
    }

  componentDidMount(){
    console.log(this.state.rooty);
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
    var width = 550,
    height = 550,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20().domain(d3.range(-1,1));
    var totalSize = 0;
    

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
      .style("stroke", "#fff")
      .style("fill", function(d) {
        if (d.name == 'MerchandiseExports'){
          return 'DodgerBlue';
        } else if (d.name == 'RetailTurnover'){
          return 'Crimson';
        } else if (d.name == 'Mineral fuels, lubricants and related materials'){
          return 'black';
        } else if (d.name == 'Crude materials, inedible, except fuels'){
          return 'brown';
        } else if (d.name == 'Manufactured goods classified chiefly by material'){
          return 'grey';
        } else if (d.name == 'Food and live animals'){
          return 'Salmon';
        } else if (d.name == 'Beverages and tobacco'){
          return  'orange';
        } else if (d.name == 'Animal and vegetable oils, fats and waxes'){
          return 'Goldenrod';
        } else if (d.name == 'Food retailing'){
          return 'MediumVioletRed';
        } else if (d.name == 'Other retailing'){
          return 'Tan';
        } else if (d.name == 'Department stores'){
          return 'Khaki';
        } else if (d.name == 'Chemicals and related products, nes'){
          return 'green';
        } else if (d.name == 'Cafes, restaurants and takeaway food services'){
          return 'RosyBrown';
        } else if (d.name == 'Commodities and transactions not classified elsewhere in the SITC'){
          return 'SteelBlue';
        } else if (d.name == 'Machinery and transport equipment'){
          return 'DarkSlateGray';
        }
        
        return 'red';
        //return  color((d.children ? d : d.parent).name); 
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
        var percentage = d.size;
        var percentageString = percentage + "%";

        d3.select("#percentage")
          .text(percentageString);

        d3.select("#dataName")
          .text(d.name);

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
        <div className="d3Holder">
          <div id="explanation">
            <span id="percentage"></span><br/>
            <span id="dataName"></span><br/>
          </div>
        </div>
        );

    }
  }

  export default D3Test;
