import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class AusMap extends React.Component {

    constructor(props){
      super(props);

    };

    componentDidMount(){

    };

    render() {
      return (<div className = "col-md-12">
                <div className="row">
                  <div id ="WA" onClick={()=>{this.props.changeSelectedStates(["WA"])}}>
                    <img onClick={()=>{this.props.changeSelectedStates(["WA"])}} src="/images/WA.png" alt="Failed to load" href="/"></img>
                  </div>
                  <div id="NT">
                    <a href="/"><img src="/images/NT.png" alt="Failed to load" href="/"></img></a>
                  </div>
                  <div id="QA">
                    <a href="/"><img src="/images/QA.png" alt="Failed to load" href="/"></img></a>
                  </div>
                  <div id="SA">
                    <a href="/"><img src="/images/SA.png" alt="Failed to load" href="/"></img></a>
                  </div>
                  <div id="NSW">
                    <a href="/"><img src="/images/NSW.png" alt="Failed to load" href="/"></img></a>
                  </div>
                  <div id="VIC">
                    <a href="/"><img src="/images/VIC.png" alt="Failed to load" href="/"></img></a>
                  </div>
                </div>
              </div>)
    }
}

export default AusMap;

// <h2 onClick={()=>{this.props.changeSelectedStates(["NSW"])}}> NSW </h2>
// <h2 onClick={()=>{this.props.changeSelectedStates(["VIC"])}}> VIC </h2>
