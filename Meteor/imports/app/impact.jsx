import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import ReactGridLayout from 'react-grid-layout';
require ('/node_modules/react-grid-layout/css/styles.css');
require ('/node_modules/react-resizable/css/styles.css');
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Impact extends React.Component {

    constructor(props){
      super(props);

    };

    componentDidMount(){

    };

    render() {
      return (<div className = "row">
                <ResponsiveReactGridLayout
                  {...this.props}
                  className="layout"
                  layouts={layouts}
                  rowHeight={window.innerHeight-((window.innerHeight/100)*3)}
                  breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                  cols={{lg: 12, md: 12, sm: 12, xs: 6, xxs: 6}}
                  measureBeforeMount={false}>
                  
                </ResponsiveReactGridLayout>
              </div>)
    }
}

export default Impact;

// <h2 onClick={()=>{this.props.changeSelectedStates(["NSW"])}}> NSW </h2>
// <h2 onClick={()=>{this.props.changeSelectedStates(["VIC"])}}> VIC </h2>
