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
      return (<div>
                <h2 onClick={()=>{this.props.changeSelectedStates(["NSW"])}}> NSW </h2>
                <h2 onClick={()=>{this.props.changeSelectedStates(["VIC"])}}> VIC </h2>
              </div>)
    }
}

export default AusMap;
