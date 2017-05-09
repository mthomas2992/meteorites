import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class MainHome extends React.Component {

    constructor(props){
      super(props);

    };

    componentDidMount(){

    };

    render() {
      return (<div className = "row">
                Main home page will go here
              </div>)
    }
}

export default MainHome;

// <h2 onClick={()=>{this.props.changeSelectedStates(["NSW"])}}> NSW </h2>
// <h2 onClick={()=>{this.props.changeSelectedStates(["VIC"])}}> VIC </h2>
