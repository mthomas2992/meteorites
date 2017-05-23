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
      console.log(this.props.data);
    }

  componentDidMount(){
    console.log(this.state.rooty);
    this.doEverything();
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
    var width = 680,
    height = 500,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20c();
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
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
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
        var percentageString = percentage + "%" + d.name;

        d3.select("#percentage")
          .text(percentageString);

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

  d3.selectAll("input").on("change", function change() {
    var value = this.value === "count"
        ? function() { return 1; }
        : function(d) { return d.size; };

    path
        .data(partition.value(value).nodes)
      .transition()
        .duration(1500)
        .attrTween("d", this.arcTween);
  });


d3.select(self.frameElement).style("height", height + "px");

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
        <div className="d3Holder"></div>
        );

    }



    // Fade all but the current sequence, and show it in the breadcrumb trail.
  mouseover(d) {
  console.log("MOUSE OVER NOW");

    // d3.select(this)
    //       .transition()
    //       .duration(1000)
    //       .ease('elastic')
    //       .style("opacity", 0.3);

    // var percentage = (100 * d.value / totalSize).toPrecision(3);
    // var percentageString = percentage + "%";
    // if (percentage < 0.1) {
    //   percentageString = "< 0.1%";
    // }

    // d3.select("#percentage")
    //     .text(percentageString);

    // d3.select("#explanation")
    //     .style("visibility", "");

    // var sequenceArray = getAncestors(d);
    //updateBreadcrumbs(sequenceArray, percentageString);

    // Fade all the segments.
    // d3.selectAll("path")
    //     .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    // vis.selectAll("path")
    //     .filter(function(node) {
    //               return (sequenceArray.indexOf(node) >= 0);
    //             })
    //     .style("opacity", 1);
  }

  // Restore everything to full opacity when moving off the visualization.
  mouseleave(d) {
  console.log("MOUSELEAVE NOW");
    // Hide the breadcrumb trail
    // d3.select("#trail")
    //     .style("visibility", "hidden");

    // // Deactivate all segments during transition.
    // d3.selectAll("path").on("mouseover", null);

    // // Transition each segment to full opacity and then reactivate it.
    // d3.selectAll("path")
    //     .transition()
    //     .duration(1000)
    //     .style("opacity", 1)
    //     .on("end", function() {
    //             d3.select(this).on("mouseover", mouseover);
    //           });

    // d3.select("#explanation")
    //     .style("visibility", "hidden");
  }

  render() {
        return(
          <div className="d3Holder">
            <div id="explanation">
              <span id="percentage"></span><br/>
              of visits begin with this sequence of pages
            </div>
          </div>
          );
      }
  }

  export default D3Test;
