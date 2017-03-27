import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class APIDocumentation extends React.Component {

    constructor(props){
      super(props);

    };

    componentDidMount(){

    };


    render() {
      if (this.props.path == "Home"){
        return (<div><h1>Home page for documentation</h1>
                </div>);
      } else {
        return (<p>doco 404</p>);
      }

    }
}

export default APIDocumentation;
