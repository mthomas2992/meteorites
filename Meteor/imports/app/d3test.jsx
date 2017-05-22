import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';


class D3Test extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        rooty : {
         "name": "flare",
         "children": [
          {
           "name": "analytics",
           "children": [
            {
             "name": "cluster",
             "children": [
              {"name": "AgglomerativeCluster", "size": 3938},
              {"name": "CommunityStructure", "size": 3812},
              {"name": "HierarchicalCluster", "size": 6714},
              {"name": "MergeEdge", "size": 743}
             ]
            },
            {
             "name": "graph",
             "children": [
              {"name": "BetweennessCentrality", "size": 3534},
              {"name": "LinkDistance", "size": 5731},
              {"name": "MaxFlowMinCut", "size": 7840},
              {"name": "ShortestPaths", "size": 5914},
              {"name": "SpanningTree", "size": 3416}
             ]
            },
            {
             "name": "optimization",
             "children": [
              {"name": "AspectRatioBanker", "size": 7074}
             ]
            }
           ]
          },
          {
           "name": "animate",
           "children": [
            {"name": "Easing", "size": 17010},
            {"name": "FunctionSequence", "size": 5842},
            {
             "name": "interpolate",
             "children": [
              {"name": "ArrayInterpolator", "size": 1983},
              {"name": "ColorInterpolator", "size": 2047},
              {"name": "DateInterpolator", "size": 1375},
              {"name": "Interpolator", "size": 8746},
              {"name": "MatrixInterpolator", "size": 2202},
              {"name": "NumberInterpolator", "size": 1382},
              {"name": "ObjectInterpolator", "size": 1629},
              {"name": "PointInterpolator", "size": 1675},
              {"name": "RectangleInterpolator", "size": 2042}
             ]
            },
            {"name": "ISchedulable", "size": 1041},
            {"name": "Parallel", "size": 5176},
            {"name": "Pause", "size": 449},
            {"name": "Scheduler", "size": 5593},
            {"name": "Sequence", "size": 5534},
            {"name": "Transition", "size": 9201},
            {"name": "Transitioner", "size": 19975},
            {"name": "TransitionEvent", "size": 1116},
            {"name": "Tween", "size": 6006}
           ]
          },
          {
           "name": "data",
           "children": [
            {
             "name": "converters",
             "children": [
              {"name": "Converters", "size": 721},
              {"name": "DelimitedTextConverter", "size": 4294},
              {"name": "GraphMLConverter", "size": 9800},
              {"name": "IDataConverter", "size": 1314},
              {"name": "JSONConverter", "size": 2220}
             ]
            },
            {"name": "DataField", "size": 1759},
            {"name": "DataSchema", "size": 2165},
            {"name": "DataSet", "size": 586},
            {"name": "DataSource", "size": 3331},
            {"name": "DataTable", "size": 772},
            {"name": "DataUtil", "size": 3322}
           ]
          },
          {
           "name": "display",
           "children": [
            {"name": "DirtySprite", "size": 8833},
            {"name": "LineSprite", "size": 1732},
            {"name": "RectSprite", "size": 3623},
            {"name": "TextSprite", "size": 10066}
           ]
          },
          {
           "name": "flex",
           "children": [
            {"name": "FlareVis", "size": 4116}
           ]
          },
          {
           "name": "physics",
           "children": [
            {"name": "DragForce", "size": 1082},
            {"name": "GravityForce", "size": 1336},
            {"name": "IForce", "size": 319},
            {"name": "NBodyForce", "size": 10498},
            {"name": "Particle", "size": 2822},
            {"name": "Simulation", "size": 9983},
            {"name": "Spring", "size": 2213},
            {"name": "SpringForce", "size": 1681}
           ]
          },
          {
           "name": "scale",
           "children": [
            {"name": "IScaleMap", "size": 2105},
            {"name": "LinearScale", "size": 1316},
            {"name": "LogScale", "size": 3151},
            {"name": "OrdinalScale", "size": 3770},
            {"name": "QuantileScale", "size": 2435},
            {"name": "QuantitativeScale", "size": 4839},
            {"name": "RootScale", "size": 1756},
            {"name": "Scale", "size": 4268},
            {"name": "ScaleType", "size": 1821},
            {"name": "TimeScale", "size": 5833}
           ]
          },
          {
           "name": "util",
           "children": [
            {"name": "Arrays", "size": 8258},
            {"name": "Colors", "size": 10001},
            {"name": "Dates", "size": 8217},
            {"name": "Displays", "size": 12555},
            {"name": "Filter", "size": 2324},
            {"name": "Geometry", "size": 10993},
            {
             "name": "heap",
             "children": [
              {"name": "FibonacciHeap", "size": 9354},
              {"name": "HeapNode", "size": 1233}
             ]
            },
            {"name": "IEvaluable", "size": 335},
            {"name": "IPredicate", "size": 383},
            {"name": "IValueProxy", "size": 874},
            {
             "name": "math",
             "children": [
              {"name": "DenseMatrix", "size": 3165},
              {"name": "IMatrix", "size": 2815},
              {"name": "SparseMatrix", "size": 3366}
             ]
            },
            {"name": "Maths", "size": 17705},
            {"name": "Orientation", "size": 1486},
            {
             "name": "palette",
             "children": [
              {"name": "ColorPalette", "size": 6367},
              {"name": "Palette", "size": 1229},
              {"name": "ShapePalette", "size": 2059},
              {"name": "SizePalette", "size": 2291}
             ]
            },
            {"name": "Property", "size": 5559},
            {"name": "Shapes", "size": 19118},
            {"name": "Sort", "size": 6887},
            {"name": "Stats", "size": 6557},
            {"name": "Strings", "size": 22026}
           ]
          },
          {
           "name": "vis",
           "children": [
            {
             "name": "axis",
             "children": [
              {"name": "Axes", "size": 1302},
              {"name": "Axis", "size": 24593},
              {"name": "AxisGridLine", "size": 652},
              {"name": "AxisLabel", "size": 636},
              {"name": "CartesianAxes", "size": 6703}
             ]
            },
            {
             "name": "controls",
             "children": [
              {"name": "AnchorControl", "size": 2138},
              {"name": "ClickControl", "size": 3824},
              {"name": "Control", "size": 1353},
              {"name": "ControlList", "size": 4665},
              {"name": "DragControl", "size": 2649},
              {"name": "ExpandControl", "size": 2832},
              {"name": "HoverControl", "size": 4896},
              {"name": "IControl", "size": 763},
              {"name": "PanZoomControl", "size": 5222},
              {"name": "SelectionControl", "size": 7862},
              {"name": "TooltipControl", "size": 8435}
             ]
            },
            {
             "name": "data",
             "children": [
              {"name": "Data", "size": 20544},
              {"name": "DataList", "size": 19788},
              {"name": "DataSprite", "size": 10349},
              {"name": "EdgeSprite", "size": 3301},
              {"name": "NodeSprite", "size": 19382},
              {
               "name": "render",
               "children": [
                {"name": "ArrowType", "size": 698},
                {"name": "EdgeRenderer", "size": 5569},
                {"name": "IRenderer", "size": 353},
                {"name": "ShapeRenderer", "size": 2247}
               ]
              },
              {"name": "ScaleBinding", "size": 11275},
              {"name": "Tree", "size": 7147},
              {"name": "TreeBuilder", "size": 9930}
             ]
            },
            {
             "name": "events",
             "children": [
              {"name": "DataEvent", "size": 2313},
              {"name": "SelectionEvent", "size": 1880},
              {"name": "TooltipEvent", "size": 1701},
              {"name": "VisualizationEvent", "size": 1117}
             ]
            },
            {
             "name": "legend",
             "children": [
              {"name": "Legend", "size": 20859},
              {"name": "LegendItem", "size": 4614},
              {"name": "LegendRange", "size": 10530}
             ]
            },
            {
             "name": "operator",
             "children": [
              {
               "name": "distortion",
               "children": [
                {"name": "BifocalDistortion", "size": 4461},
                {"name": "Distortion", "size": 6314},
                {"name": "FisheyeDistortion", "size": 3444}
               ]
              },
              {
               "name": "encoder",
               "children": [
                {"name": "ColorEncoder", "size": 3179},
                {"name": "Encoder", "size": 4060},
                {"name": "PropertyEncoder", "size": 4138},
                {"name": "ShapeEncoder", "size": 1690},
                {"name": "SizeEncoder", "size": 1830}
               ]
              },
              {
               "name": "filter",
               "children": [
                {"name": "FisheyeTreeFilter", "size": 5219},
                {"name": "GraphDistanceFilter", "size": 3165},
                {"name": "VisibilityFilter", "size": 3509}
               ]
              },
              {"name": "IOperator", "size": 1286},
              {
               "name": "label",
               "children": [
                {"name": "Labeler", "size": 9956},
                {"name": "RadialLabeler", "size": 3899},
                {"name": "StackedAreaLabeler", "size": 3202}
               ]
              },
              {
               "name": "layout",
               "children": [
                {"name": "AxisLayout", "size": 6725},
                {"name": "BundledEdgeRouter", "size": 3727},
                {"name": "CircleLayout", "size": 9317},
                {"name": "CirclePackingLayout", "size": 12003},
                {"name": "DendrogramLayout", "size": 4853},
                {"name": "ForceDirectedLayout", "size": 8411},
                {"name": "IcicleTreeLayout", "size": 4864},
                {"name": "IndentedTreeLayout", "size": 3174},
                {"name": "Layout", "size": 7881},
                {"name": "NodeLinkTreeLayout", "size": 12870},
                {"name": "PieLayout", "size": 2728},
                {"name": "RadialTreeLayout", "size": 12348},
                {"name": "RandomLayout", "size": 870},
                {"name": "StackedAreaLayout", "size": 9121},
                {"name": "TreeMapLayout", "size": 9191}
               ]
              },
              {"name": "Operator", "size": 2490},
              {"name": "OperatorList", "size": 5248},
              {"name": "OperatorSequence", "size": 4190},
              {"name": "OperatorSwitch", "size": 2581},
              {"name": "SortOperator", "size": 2023}
             ]
            },
            {"name": "Visualization", "size": 16540}
           ]
          }
         ]
        }
      }
      this.doEverything = this.doEverything.bind(this);
      this.stash = this.stash.bind(this);
      this.arcTween = this.arcTween(this);
    }

  componentDidMount(){
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

doEverything() {
    var width = 480,
    height = 350,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20c();

  var svg = d3.select(".d3Holder").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

  var root = this.state.rooty;
  var path = svg.datum(root).selectAll("path")
      .data(partition.nodes)
    .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .style("fill-rule", "evenodd")
      .each(this.stash);

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


  var path = svg.datum(root).selectAll("path")
      .data(partition.nodes)
    .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .style("fill-rule", "evenodd")
      .each(this.stash);

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
  }

render() {
      return(
        <div className="d3Holder"></div>
        );
    }
}

export default D3Test;
