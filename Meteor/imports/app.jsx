import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

    constructor(props){
      super(props);

      this.state = {

      };

    };


    render() {
      if (this.props.path == "Home"){
        return (<h1>Home page for the meteorites</h1>);
      } else {
        return (<p>404</p>);
      }

    }
}

export default App;
