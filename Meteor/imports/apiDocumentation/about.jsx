import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';



class About extends React.Component {

    constructor(props){
      super(props);
      this.state = {}

     // this.loadData = this.loadData.bind(this);
    };

    
    render() {

          return(<div>
            HELLO
                </div>);

    }
}

export default About;
