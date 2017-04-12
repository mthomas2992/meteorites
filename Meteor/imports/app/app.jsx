import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import Briefs from '/imports/app/briefs.jsx';
import AusMap from '/imports/app/ausMap.jsx';


import ReactGridLayout from 'react-grid-layout';
require ('/node_modules/react-grid-layout/css/styles.css');
require ('/node_modules/react-resizable/css/styles.css');

import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class App extends React.Component {

    constructor(props){
      super(props);

      this.state = {
        selectedStates : [],
        timePeriodStart : "2015-09-09",
        timePeriodEnd : "2016-09-09",
        industry:"Exports"
      }

      this.onBreakpointChange = this.onBreakpointChange.bind(this);
    };

    componentDidMount(){

    };

    onBreakpointChange(breakpoint){
      console.log(breakpoint)
    }

    render() {
      var layout = [
       {i: 'map', x: 0, y: 0, w:6 , h:1 , static:true},
       {i: 'briefs', x: 6, y: 0, w: 6, h: 1, static:true}
      ];

      var layouts = {lg:layout};
      console.log("called");
      console.log(window.innerHeight);

      if (this.props.path == "Home"){
        return (<div id="home" className="container-fluid">
                  <div className="row">
                    <ResponsiveReactGridLayout
                      {...this.props}
                      className="layout"
                      layouts={layouts}
                      rowHeight={window.innerHeight-((window.innerHeight/100)*3)}
                      breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                      cols={{lg: 12, md: 12, sm: 12, xs: 6, xxs: 6}}
                      measureBeforeMount={false}
                      onBreakpointChange={this.onBreakpointChange}>
                      <div id = "mapRoot" key={"map"}> <AusMap/></div>
                      <div key={"briefs"}> <Briefs/></div>
                    </ResponsiveReactGridLayout>
                  </div>

                </div>);
      } else {
        return (<div><a href="http://meteoristics.com/api/documentation?ver=v1"><h1> Meteoristics API Documentation </h1></a> <p>404</p></div>);
      }

    }
}

export default App;
