import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class CustomImpact extends React.Component {

    constructor(props){
      super(props);

    };

    componentWillMount(){
      //load data for given dates one year ago
    };

    render() {
      return (<div className = "row">

              </div>)
    }
}

export default CustomImpact;
